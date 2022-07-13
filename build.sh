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
    echo "   2) -u|--update  : uses npm to update react pkgs"
    echo "   3) -t|--test    : tests the backend library    "
    echo
}

#################################################################
#                             MAIN                              #
#################################################################
SCRIPTERNAME=`basename $0`
BASE_DIR=`pwd`
ENV_DIR=$BASE_DIR/venv
BASE_FRONTEND_DIR=$BASE_DIR/frontend

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
    -u|--update)
        cd $BASE_FRONTEND_DIR
        npm update
        cd $BASE_DIR
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