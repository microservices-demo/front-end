node {
    def app

    stage('Clone repository') {
        /* Let's make sure we have the repository cloned to our workspace */

        checkout scm
    }
    /*
    stage('Build image') {
        app = docker.build("stevenzhou2006/front-end")
    }
    stage('Push image') {
        docker.withRegistry('https://registry.ocbi.com', '') {
            app.push("${env.BUILD_NUMBER}")
            app.push("latest")
        }
    }
    */
    stage('Deploy') {        
        sshagent(['c7d2aef7-d956-4c4d-bf75-d3bed4a96f34']) {
            sh "ssh steven@23.97.67.158 uname -a"
        }        
    }     
}
