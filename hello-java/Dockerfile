FROM  phusion/baseimage

LABEL maintainer "franzwagner.str@gmail.com"

RUN echo "deb http://archive.ubuntu.com/ubuntu trusty main universe" > /etc/apt/sources.list && \
    apt-get -y update && \
    apt-get install sudo && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y -q python-software-properties software-properties-common

ENV JAVA_VER 8
ENV JAVA_HOME /usr/lib/jvm/java-8-oracle

RUN echo 'deb http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main' >> /etc/apt/sources.list && \
    echo 'deb-src http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main' >> /etc/apt/sources.list && \
    sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys C2518248EEA14886 && \
    sudo apt-get update && \
    echo oracle-java${JAVA_VER}-installer shared/accepted-oracle-license-v1-1 select true | sudo /usr/bin/debconf-set-selections && \
    sudo apt-get install -y --force-yes --no-install-recommends oracle-java${JAVA_VER}-installer oracle-java${JAVA_VER}-set-default && \
    sudo apt-get clean && \
    sudo rm -rf /var/cache/oracle-jdk${JAVA_VER}-installer && \
    update-java-alternatives -s java-8-oracle && \
    echo "export JAVA_HOME=/usr/lib/jvm/java-8-oracle" >> ~/.bashrc && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /app/

COPY HelloJava.java /app/

RUN javac HelloJava.java
CMD java HelloJava
