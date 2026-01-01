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
                    docker image three_tier_backend:latest dheeraj1kumar/three_tier_backend:latest
                    docker push dheeraj1kumar/three_tier_backend:latest

                    docker image three_tier_frontend:latest dheeraj1kumar/three_tier_frontend:latest
                    docker push dheeraj1kumar/three_tier_frontend:latest


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