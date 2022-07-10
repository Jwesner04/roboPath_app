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
RUN apt-get update
RUN apt-get install -y build-essential gdb

# Install python dependencies
RUN apt-get install -y python3-pip
RUN /usr/bin/python3 -m pip install -U autopep8
RUN apt-get install -y python3-venv
RUN pip install wheel
RUN pip install setuptools
RUN pip install twine
RUN pip install pytest==4.4.1
RUN pip install pytest-runner==4.4

WORKDIR /app/

RUN chmod -R 777 .

CMD ["/bin/bash"]