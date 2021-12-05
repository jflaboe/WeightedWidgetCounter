import boto3
import shutil
import zipfile
import os
from os.path import basename
 
def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file), arcname=os.path.join(root, file).replace(path, ""))
try:
    shutil.rmtree('./build')
except:
    pass
shutil.copytree('./env/Lib/site-packages', './build')
shutil.copy('./lambda_function.py', './build/lambda_function.py')
zipf = zipfile.ZipFile('./build/deployment.zip', 'w', zipfile.ZIP_DEFLATED)
zipdir('./build', zipf)
for file in os.listdir('./build'):
    if file.endswith(".py"):
        zipf.write(os.path.join('./build/' + file), arcname=file)
zipf.close()

client = boto3.client('lambda', region_name='us-west-2')
with open('./build/deployment.zip', 'rb') as f:
    client.update_function_code(
        FunctionName='get-widget-configuration',
        ZipFile=f.read()
    )