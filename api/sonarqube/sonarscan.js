const scanner = require("sonarqube-scanner");

scanner(
  {
    serverUrl: "http://localhost:9000",
    token: "65f549e4d54f60f2873df15f3ea9d2aa464d90e8",
    options: {
      "sonar.projectName": "server-api",
      "sonar.projectDescription": "Here I can add a description of my project",
      "sonar.projectKey": "server-api",
      "sonar.projectVersion": "0.0.1",
      "sonar.exclusions": "",
      "sonar.sourceEncoding": "UTF-8",
    },
  },
  () => process.exit()
);
