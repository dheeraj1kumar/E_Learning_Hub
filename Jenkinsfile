pipeline {
    agent any

    stages {
        stage('Code') {
            steps {
                git url: "https://github.com/dheeraj1kumar/E_Learning_Hub.git", branch: "main"
            }
        }

       stage('Build with Docker Compose') {
    steps {
        sh '''
            echo "🛠️ Building and starting using Docker Compose..."
            
            docker-compose build 
            
        '''
    }
}


        stage("Push To DockerHub") {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "dockerhub",
                    usernameVariable: "dockerHubUser",
                    passwordVariable: "dockerHubPass"
                )]) {
                    sh '''
                        echo $dockerHubPass | docker login -u $dockerHubUser --password-stdin
                        docker tag project:latest $dockerHubUser/project:latest
                        docker push $dockerHubUser/project:latest
                    '''
                }
            }
        }


        stage('Deploy') {
            steps {
                sh '''
                    echo "🚀 Deploying application..."
                    docker-compose down
                    docker-compose up -d
                '''
            }
        }
    }

    post {
        always {
            echo "🧹 Cleaning up..."
            sh 'docker image prune -f || true'
        }
    }
}