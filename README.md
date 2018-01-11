# menuexplorer
When you travel aboard, sometimes you like to be adventures and go to local restaurants but some of them don't have English menu. menu explorer translates the menu in English for you and shows the picture of the items in the menu.
It's an interactive menu and allows you to bing or google search the items and helps you to understand the menus in foreign languages

Is an application to allow you to explore the food menu and translate it for you.

This project has two parts. 

 1- menuexplorerfuncapp
 2- menuexplorerapp

You can easily run and test the application locally. The application is also hosted on Azure https://themenuexplorer.azurewebsites.net/ 

## 1- menuexplorerfuncapp
contains of azure functions (serverless) to work with microsoft cognitive services. To know more about cognitive services and try it check out  https://azure.microsoft.com/en-us/try/cognitive-services/


Computer vision - OCR: detecting handwritten or printed text in an image and then converting them into machine-encoded text - more info https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision/

Translate: translate text from any language to english - more info  https://docs.microsofttranslator.com/text-translate.html

BingImageSearch: searching bing indexed images and returing result - more info 
https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference

you can run the project on your local computer - if you have Visual Studio 2017 15.3 (or later) and “Azure development” workload installed on your computer 
https://blogs.msdn.microsoft.com/webdev/2017/05/10/azure-function-tools-for-visual-studio-2017/
https://docs.microsoft.com/en-us/visualstudio/install/install-visual-studio
also, please make sure you get subscription keys for each of the services. All of them have free tier so there won't be any cost involved.

local Settings and Cors with Azure functions 

you need to copy and update local.settings.json from documents folder to menuexplorerfuncapp folder and make sure "Copy to output directly" set to "copy if newer"

https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local

More info: https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local


## 2- menuexplorerapp

you need node js installed on your computer to get the client app running. 
run npm install to install dependency packages - It uses express to host the application and for the client side it's basic javascript/jquery 

run npm start to run the application 

### How to deploy the application to Azure

Since the application has two seperate projects, you may wonder what's the easiest way to deploy it azure. The easiest way is before setting the deployment options first we need to set the 'PROJECT' property in the app settings

Set value of 'PROJECT' to **menuexplorerfuncapp/menuexplorerfuncapp.csproj** for your azure function

Set value of 'PROJECT' to **menuexplorerapp** for your node js web app


more info:
https://www.hanselman.com/blog/DeployingTWOWebsitesToWindowsAzureFromOneGitRepository.aspx
https://github.com/projectkudu/kudu/wiki/Customizing-deployments



