curl -L  https://github.com/coreos/etcd/releases/download/v2.3.1/etcd-v2.3.1-linux-amd64.tar.gz -o etcd-v2.3.1-linux-amd64.tar.gz
tar xzvf etcd-v2.3.1-linux-amd64.tar.gz
cd etcd-v2.3.1-linux-amd64
nohup ./etcd --name "ubuntu$1" \
--listen-peer-urls="http://172.16.0.2$1:2380" \
--listen-client-urls="http://172.16.0.2$1:2379" \
--initial-advertise-peer-urls="http://172.16.0.2$1:2380" \
--advertise-client-urls="http://172.16.0.2$1:2379" \
--initial-cluster "ubuntu1=http://172.16.0.21:2380,ubuntu2=http://172.16.0.22:2380,ubuntu3=http://172.16.0.23:2380" &
