import scanner from "sonarqube-scanner";

scanner(
  {
    serverUrl: "http://localhost:9000",
    token: "cd52af61455181777708f209cb3fe97c8efca0bd",
    options: {
      "sonar.projectName": "server-ui",
      "sonar.projectDescription": "Here I can add a description of my project",
      "sonar.projectKey": "server-ui",
      "sonar.projectVersion": "0.0.1",
      "sonar.exclusions": "",
      "sonar.sourceEncoding": "UTF-8",
    },
  },
  () => process.exit()
);
