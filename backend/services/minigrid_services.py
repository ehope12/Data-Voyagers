# File: backend/services/get_cloud_cover.p
import subprocess
import os
import re

aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
aws_region = os.getenv('AWS_DEFAULT_REGION')

def get_cloud_cover_percentage(folder_url):
    """
    Retrieves the cloud cover percentage from the MTL file of a Landsat acquisition folder in S3.

    Args:
        folder_url (str): The URL to the Landsat acquisition folder on AWS S3.

    Returns:
        float: The cloud cover percentage if found.
        str: Error message if unable to retrieve the value.
    """
    try:
        # Run the AWS CLI command to list all files in the folder
        command = f"aws s3 ls {folder_url} --request-payer requester"
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        
        if result.returncode != 0:
            raise Exception(f"Error listing folder contents: {result.stderr}")

        # Extract the MTL file from the listed contents
        lines = result.stdout.splitlines()
        mtl_file = None
        for line in lines:
            if 'MTL.txt' in line:
                mtl_file = line.split()[-1]
                break

        if not mtl_file:
            raise Exception("No MTL file found in the specified folder.")

        # Construct the full S3 URL for the MTL file
        mtl_url = os.path.join(folder_url, mtl_file)

        # Download the MTL file using AWS S3 command
        local_mtl_file = 'temp_MTL.txt'
        download_command = f"aws s3 cp {mtl_url} {local_mtl_file} --request-payer requester"
        download_result = subprocess.run(download_command, shell=True, capture_output=True, text=True)
        
        if download_result.returncode != 0:
            raise Exception(f"Error downloading MTL file: {download_result.stderr}")

        # Read the cloud coverage percentage from the downloaded MTL file
        with open(local_mtl_file, 'r') as file:
            content = file.read()
        
        # Use regex to find the CLOUD_COVER value
        cloud_cover_match = re.search(r'CLOUD_COVER\s*=\s*([0-9.]+)', content)
        if cloud_cover_match:
            cloud_cover = float(cloud_cover_match.group(1))
        else:
            raise Exception("CLOUD_COVER information not found in the MTL file.")

        # Clean up the temporary file
        os.remove(local_mtl_file)

        return cloud_cover

    except Exception as e:
        return str(e)


# Example of how to use the function
if __name__ == "__main__":
    folder_url = "s3://usgs-landsat/collection02/level-1/standard/oli-tirs/2023/233/095/LC09_L1TP_233095_20231228_20231228_02_T1/"
    cloud_cover = get_cloud_cover_percentage(folder_url)
    print("Cloud Cover Percentage:", cloud_cover)
