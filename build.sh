# ----------------------------------------------------------------------------------- #
# The below bash file builds or tests the robo library                                #
#                                                                                     #
# © 2022 Jonathan Wesner                                                              #
#                                                                                     #
# References:                                                                         #
#    https://medium.com/analytics-vidhya/how-to-create-a-python-library-7d5aea80cc3f  #
#                                                                                     #
# ----------------------------------------------------------------------------------- #

#################################################################
# prints latest options to user
#################################################################
function printHelp {
    echo
    echo "--------------------------------------------------"
    echo " $SCRIPTERNAME::Help"
    echo "--------------------------------------------------"
    echo "   1) -h|--help    : prints help menu             "
    echo
}

#################################################################
#                             MAIN                              #
#################################################################
SCRIPTERNAME=`basename $0`
BASE_DIR=/workspace
ENV_DIR=/workspace/venv

cd $BASE_DIR
if [ -d $ENV_DIR ]
then
    python3 -m venv venv
    source venv/bin/activate
fi

for option in "$@"
do
    case $option
    in
    -h|--help)
        printHelp
        exit
        ;;
    -t|--test)
        cd $BASE_DIR
        python3 setup.py pytest
        exit
        ;;
    *)
        echo "------------------------------------"
        echo " $SCRIPTERNAME: Invalid user option "
        echo " $SCRIPTERNAME: See help menu below "
        echo "------------------------------------"
        printHelp
        exit
        ;;
    esac
done

python3 setup.py bdist_wheel
pip3 install /workspace/dist/*.whl --force-reinstall