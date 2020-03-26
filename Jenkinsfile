@Library('eigi-jenkins-library') _
def gitCmd = new common.v1.GitCmd(this)
def runWith = new common.v1.RunWith(this)
def when = new common.v1.When(this)
def awsTools = new ctct.v1.AwsTools(this)

node('p2-team-jenkins-slave-14.ctct.net') {
    def tagVersion = "${env.JOB_NAME}-${env.GIT_BRANCH_NAME}-${env.BUILD_NUMBER}"
    def ecrRepo = '428791060841.dkr.ecr.us-east-1.amazonaws.com/argocd-test-repo'
    def containerInRepo = "${ecrRepo}:${tagVersion}"
    dir('app-repo') {
        gitCmd.checkout()

        runWith.nodeJS('10.13.0') {
            sh('npm install')
        }

        def repo = 'front-end'

        withAWS(credentials: 'jesnkins-bfa-user',
                role: 'ctct-deploy-qa-ecr-access',
                roleAccount: '428791060841',
                region: 'us-east-1') {
            def login = ecrLogin()
            sh login
            docker.build(containerInRepo, '. --network=host').push()
        }

    }

    dir('app-registry') {
        def appRegistry = 'https://github.com/citizenken/argocd-project-registry.git'
        gitCmd.checkoutRemoteWithBranch(appRegistry, 'master', 'jenkins-ssh')

        def application = readYaml file: 'apps/sock-shop/application.yaml'
        def namespace = readYaml file: 'apps/sock-shop/namespace.yaml'
        def appPRName = "${application.metadata.name}-${env.BRANCH_NAME}"

        application.metadata.labels.release = 'pr'
        application.metadata.name = appPRName
        application.spec.destination.namespace = appPRName
        application.spec.source.helm.parameters = [
            [
                name : 'image.tag',
                value : tagVersion
                ],
            [
                name : 'image.repository',
                value : containerInRepo
                ]
        ]

        namespace.metadata.name = appPRName

        writeYaml file: "pr-apps/sock-shop-${env.BRANCH_NAME}/application.yaml", data: application
        writeYaml file: "pr-apps/sock-shop-${env.BRANCH_NAME}/namespace.yaml", data: namespace

        readFile "pr-apps/sock-shop-${env.BRANCH_NAME}/application.yaml"
        readFile "pr-apps/sock-shop-${env.BRANCH_NAME}/namespace.yaml"

        sh """
        git add ./pr-apps
        git commit -m "adding sock-shop-${env.BRANCH_NAME}"
        git push
        """
    }
}
