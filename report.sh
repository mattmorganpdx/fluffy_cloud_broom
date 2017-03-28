#!/bin/bash

LOG=/var/log/report.log

while [[ true ]] ;
do
    curl www.charlesamoss.com/raspie/index.php?status |grep START
        if [[ $? == 0 ]] ; then
            curl www.charlesamoss.com/raspie/index.php?log=CHECKIN%20$(date +%FT%H:%M:%S)
            echo $(date) logged to server >> $LOG
        else
            echo $(date) did not log to server >> $LOG
        fi
        sleep 10
done
