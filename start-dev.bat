@echo off
echo 设置环境变量...
set NVM_HOME=E:\Program Files (x86)\nvm
set NVM_SYMLINK=E:\Program Files\nodejs
set PATH=%PATH%;%NVM_HOME%;%NVM_SYMLINK%

echo 激活Node.js 18.17.1...
"%NVM_HOME%\nvm.exe" use 18.17.1

echo 启动图片服务器...
start "Image Server" node image-server.js

echo 启动Angular开发服务器...
start "Angular Server" npm start

echo 开发环境启动完成！
echo 图片服务器运行在: http://localhost:8001/
echo Angular应用运行在: http://localhost:4200/
pause
