from setuptools import find_packages, setup

setup(
    name='roboApp',
    packages=find_packages(include=['roboLib', 'schemas']),
    version='0.1.0',
    description='Help the Robot get to its destination',
    author='Jonathan Wesner',
    license='MIT',
    install_requires=[],
    setup_requires=['pytest-runner', 'wheel'],
    tests_require=['pytest==4.4.1'],
    test_suite='tests',
)
