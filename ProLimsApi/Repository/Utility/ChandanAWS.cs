using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace ProLimsApi.Repository.Utility
{
    public class ChandanAWS
    {
        public static string B2BDocument(byte[] data, string extension, string ImageName)
        {
            AmazonS3Bucket OBJ = new AmazonS3Bucket();
            string responses = string.Empty;
            string bucketName = "chandandocs";
            string localpath = "I:\\B2B\\B2BDocument\\ExDoc" + extension;
            try
            {
                if (!Directory.Exists("I:\\B2B\\B2BDocument"))
                    Directory.CreateDirectory("I:\\B2B\\B2BDocument");

                File.WriteAllBytes(localpath, data);
                string CloudPath = "B2BDocument/" + System.DateTime.UtcNow.Year + "/" + ImageName;
                using (var fileStream = File.OpenRead(localpath))
                {
                    OBJ.UploadFile(bucketName, CloudPath, localpath);
                    string CloudSyncPath = "https://" + bucketName + ".s3.ap-south-1.amazonaws.com/" + CloudPath;
                    responses = CloudSyncPath;
                }
            }
            catch (Exception ex)
            {
                responses = ex.Message;
            }
            return responses;
        }
    }
}