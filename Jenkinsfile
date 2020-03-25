@Library('eigi-jenkins-library') _
def gitCmd = new common.v1.GitCmd(this)
def runWith = new common.v1.RunWith(this)
def when = new common.v1.When(this)

node {
    def tagVersion = "${env.JOB_NAME}-${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
    dir('app-repo') {
        gitCmd.checkout()

        runWith.nodeJS('10.13.0') {
            sh('npm install')
        }

        def repo = 'front-end'
        docker.build("${repo}:${tagVersion}")
    }

    dir('app-registry') {
        def appRegistry = 'git@github.com:citizenken/argocd-project-registry.git'
        gitCmd.checkoutRemoteWithBranch(appRegistry, 'master', 'jenkins-ssh')

        def application = readYaml file: 'apps/sock-shop/application.yaml'
        def namespace = readYaml file: 'apps/sock-shop/namespace.yaml'
        def appPRName = "${application.metadata.name}-${env.BRANCH_NAME}"

        application.metadata.labels.release = 'pr'
        application.metadata.name = appPRName
        application.spec.destination.namespace = appPRName
        application.spec.source.helm = [
            name : 'image.tag',
            value : tagVersion
        ]

        namespace.metadata.name = appPRName

        writeYaml file: "pr-apps/sock-shop-${env.BRANCH_NAME}/application.yaml", data: application
        writeYaml file: "pr-apps/sock-shop-${env.BRANCH_NAME}/namespace.yaml", data: namespace

        readFile "pr-apps/sock-shop-${env.BRANCH_NAME}/application.yaml"
        readFile "pr-apps/sock-shop-${env.BRANCH_NAME}/namespace.yaml"
    }
}
