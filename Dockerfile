# -------------------------------------------------------------------------- #
# The below code is a test dockerfile used to build a base image for         #
# c++ development environment.                                               #
#                                                                            #
# © 2022 Jonathan Wesner                                                     #
#                                                                            #
# References: https://hub.docker.com/_/gcc?tab=description                   #
# -------------------------------------------------------------------------- #
FROM gcc:latest

USER root

# ----------------
# Dependencies
# ---
COPY . /app/

# Install gdb type stuff
# update package manager(s)
RUN apt -y update \ 
    && apt-get -y update

# Install python dependencies
RUN apt-get install -y python3-pip
RUN /usr/bin/python3 -m pip install -U autopep8
RUN apt-get install -y python3-venv
RUN pip install wheel
RUN pip install setuptools
RUN pip install twine
RUN pip install pytest==4.4.1
RUN pip install pytest-runner==4.4
RUN pip install fastapi
RUN pip install uvicorn

# install helpers
RUN apt-get install -y git \ 
    && apt-get install -y dos2unix \
    && apt-get install -y nano \
    && apt-get install -y iproute2 \
    && apt-get install -y curl

# install nvm install
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash \
    && exec bash \
    && nvm install 14.4.0

# install nodejs and nvm
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest \
    && apt install build-essential \
    # just prints out version numbers for records
    && node -v \
    && npm --version

# install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt -y install --no-install-recommends yarn \
    # just prints out version numbers for records
    && yarn --version

# install react
RUN npm -g install create-react-app

WORKDIR /app/

RUN chmod -R 777 .

CMD ["/bin/bash"]

# TODO: Add a non-root user and switch to that user