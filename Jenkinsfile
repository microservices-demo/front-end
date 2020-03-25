@Library('eigi-jenkins-library') _
def gitCmd = new common.v1.GitCmd(this)
def runWith = new common.v1.RunWith(this)
def when = new common.v1.When(this)

node {
    gitCmd.checkout()

    runWith.nodeJS('10.13.0') {
        sh('npm install')
    }
    def tagVersion = "${env.JOB_NAME}-${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
    def repo = 'front-end'
    docker.build("${repo}:${tagVersion}")

    dir('helm-charts') {
        def chartRepo = 'git@github.com:citizenken/argocd-example-apps.git'
        gitCmd.checkoutRemoteWithBranch('git@github.com:citizenken/argocd-example-apps.git', 'master', 'jenkins-ssh')
        def chart = readYaml file: 'helm-socks-frontend/Chart.yaml'
        chart.appVersion = "${tagVersion}"
        writeYaml file: 'helm-socks-frontend/Chart.yaml', data: chart

        sh """
        kubectl create namespace ${env.JOB_NAME}-${env.BRANCH_NAME}
        argocd app create ${env.JOB_NAME}-${env.BRANCH_NAME} \
        --repo chartRepo \
        --path helm-socks-frontend \
        --dest-namespace ${env.JOB_NAME}-${env.BRANCH_NAME} \
        --dest-server https://kubernetes.default.svc
        argocd app sync ${env.JOB_NAME}-${env.BRANCH_NAME} --local helm-socks-frontend
        argocd app wait ${env.JOB_NAME}-${env.BRANCH_NAME}
        """
    }
}
