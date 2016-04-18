# -*- mode: ruby -*-
# vi: set ft=ruby :

NUMBER_OF_BOXES_TO_CREATE = 3
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(2) do |config|

  (1..NUMBER_OF_BOXES_TO_CREATE).each do |machineNumber|

    config.vm.define "ubuntu#{machineNumber}" do |machine|
      machine.vm.box = "ubuntu/trusty64"
      machine.vm.hostname = "ubuntu#{machineNumber}.vagrant.local"
      machine.vm.network "private_network", ip: "172.16.0.#{20 + machineNumber}"
      machine.vm.provision "shell", path: "./install.sh", args: [machineNumber]
    end
  end
end
