<!-- To Build 

kubectl create namespace sre-challenge

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install prometheus prometheus-community/kube-prometheus-stack --namespace sre-challenge

kubectl apply -f redis-deployment.yaml

kubectl port-forward -n sre-challenge svc/prometheus-kube-prometheus-prometheus 9090:9090 -->


<!-- To Test run

curl http://localhost:3000

curl http://localhost:3000/metrics 

-->
