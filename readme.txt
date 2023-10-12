take a file that is in the same folder as you are (the simplest way use this)
and run this command (replace the aaa.xls with your xls file [and chamge the port as well])

curl -X POST -F "xlsFile=@aaa.xls" http://localhost:8001/upload  