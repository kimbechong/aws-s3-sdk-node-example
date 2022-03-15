// Import required AWS SDK clients and commands for Node.js.
import { PutObjectCommand, CreateBucketCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./client.js";

// Set the parameters
const params = {
  Bucket: "kimbechong", // The name of the bucket. For example, 'sample_bucket_101'.
  Key: "sample.txt", // The name of the object. For example, 'sample_upload.txt'.
  Body: "Hello world!", // The content of the object. For example, 'Hello world!".
};

const publicPolicy = {
  "Version": "2012-10-17",
  "Statement": [
      {
          "Sid": "public-read",
          "Effect": "Allow",
          "Principal": "*",
          "Action": [
              "s3:GetObject",
              "s3:GetObjectVersion"
          ],
          "Resource": "arn:aws:s3:::kimbechong/*"
      }
  ]
}

const run = () => {
  s3Client
    .send(new CreateBucketCommand({ Bucket: params.Bucket }))
    .then((data) => {
      console.log("Successfully created a bucket called ", data.Location);
    })
    .then(() => {
      return s3Client.send(new PutObjectCommand(params));
    })
    .then(() => {
      return s3Client.send(new PutBucketPolicyCommand({
        Bucket: params.Bucket,
        Policy: JSON.stringify(publicPolicy)
      }));
    })
    .then(() => {
      console.log(
        "Successfully created " +
          params.Key +
          " and uploaded it to " +
          params.Bucket +
          "/" +
          params.Key
      );
    })
    .catch((err) => {
      console.log(err);
    });
};

run();
