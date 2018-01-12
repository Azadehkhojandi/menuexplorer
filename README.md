# Menu Explorer
Menu Explorer is an application to allow you to take a photo of a local menu and have it display graphics of the dishes and translate it for you.

When you travel aboard, sometimes you like to be adventurous and check out the local restaurants. However if you are in a country that speaks a different language it can be difficult to order. Menu explorer not only translates the menu in English for you, but can also display pictures of the dish based on the original language. This helps with many dishes where literal translations are don't work (e.g. a "Baked Alaska"). 


This project has two parts:
1. menuexplorerfuncapp
2. menuexplorerapp

You can easily run and test the application locally. The application is also hosted on Azure https://themenuexplorer.azurewebsites.net/ 

## 1- menuexplorerfuncapp
Contains azure functions (serverless) to work with Microsoft cognitive services. To know more about cognitive services and try it check out  https://azure.microsoft.com/en-us/try/cognitive-services/


- **Computer vision - OCR:** detecting handwritten or printed text in an image and then converting them into machine-encoded text. https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision/

- **Translate:** translate text from any language to english. https://docs.microsofttranslator.com/text-translate.html

- **BingImageSearch:** searching bing indexed images and returing result. 
https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference

### Running locally
You can run the project on your local computer - if you have Visual Studio 2017 15.3 (or later) and “Azure development” workload installed on your computer 
https://blogs.msdn.microsoft.com/webdev/2017/05/10/azure-function-tools-for-visual-studio-2017/
https://docs.microsoft.com/en-us/visualstudio/install/install-visual-studio
also, please make sure you get subscription keys for each of the services. All of them have free tier so there won't be any cost involved.

### Local Settings and CORS with Azure functions 

you need to copy and update local.settings.json from documents folder to menuexplorerfuncapp folder and make sure "Copy to output directly" set to "copy if newer"

More info: https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local


## 2- menuexplorerapp

You need node js installed on your computer to get the client app running. 
run npm install to install dependency packages - It uses express to host the application and for the client side it's basic javascript/jquery 

run ```npm start``` to start the application 

## How to deploy the solution to Azure

As the solution has 2 parts to it, before setting the deployment options first we need to set the 'PROJECT' property in the app settings

- Set value of 'PROJECT' to ```menuexplorerfuncapp/menuexplorerfuncapp.csproj``` for your azure function
- Set value of 'PROJECT' to ```menuexplorerapp``` for your node js web app

more info:
https://www.hanselman.com/blog/DeployingTWOWebsitesToWindowsAzureFromOneGitRepository.aspx
https://github.com/projectkudu/kudu/wiki/Customizing-deployments
