using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Transfer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProLimsApi.Repository.Utility
{
    public class AmazonS3Bucket
    {
        public void UploadFile(string bucketName, string keyName, string filePath)
        {
            BasicAWSCredentials credentials = new BasicAWSCredentials("AKIAZI2LDS2Q5EIMCLGH", "8Oiv6mf5GTFFEdScVstdj5/6bUaSVauQAz4U9Dce");
            var client = new AmazonS3Client(credentials, Amazon.RegionEndpoint.APSouth1);
            var transferUtility = new TransferUtility(client);
            try
            {
                string FileType = "text/plain";
                if (filePath.Contains("pdf"))
                    FileType = "application/pdf";

                TransferUtilityUploadRequest transferUtilityUploadRequest = new TransferUtilityUploadRequest
                {
                    BucketName = bucketName,
                    Key = keyName,
                    FilePath = filePath,
                    ContentType = FileType
                };
                transferUtility.Upload(transferUtilityUploadRequest); // use UploadAsync if possible
            }
            catch (Exception ex) { }
        }
        static async System.Threading.Tasks.Task Main(string[] args)
        {
            string bucketName = "your-bucket-name";
            string filePath = "path/to/your/file.txt"; // Path to the file you want to upload
            string keyName = "file.txt"; // The name you want to give to the file in the bucket

            try
            {
                var s3Client = new AmazonS3Client(RegionEndpoint.USWest2); // Specify the region where your bucket is located

                var fileTransferUtility = new TransferUtility(s3Client);

                await fileTransferUtility.UploadAsync(filePath, bucketName, keyName);

                Console.WriteLine("File upload completed");
            }
            catch (AmazonS3Exception e)
            {
                Console.WriteLine("Error encountered on server. Message:'{0}' when writing an object", e.Message);
            }
            catch (Exception e)
            {
                Console.WriteLine("Unknown encountered on server. Message:'{0}' when writing an object", e.Message);
            }
        }
    }
}