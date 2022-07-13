# -------------------------------------------------------------------------- #
# The below starts up the backend server, and the frontend                   #
#                                                                            #
# © 2022 Jonathan Wesner                                                     #
#                                                                            #
# -------------------------------------------------------------------------- #

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
BASE_DIR=`pwd`
BASE_BACKEND_DIR=$BASE_DIR/backend
BASE_FRONTEND_DIR=$BASE_DIR/frontend

cd $BASE_BACKEND_DIR
python3 app.py &

cd $BASE_FRONTEND_DIR
npm start
cd $BASE_DIR

# The below is there for any added command options in the future.
# Currently, it is unused
for option in "$@"
do
    case $option
    in
    -h|--help)
        printHelp
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