# Script that checks the internet connection shows the expected country
EXPECTED_COUNTRY="ES"
COUNTRY_CONNECTION=$(curl -s ipinfo.io | jq '.country'| tr -d "\"") 
RED='\033[0;31m'
if [ $COUNTRY_CONNECTION != $EXPECTED_COUNTRY ]
then
  echo -e "Internet connection detected from ${COUNTRY_CONNECTION} and expected to ${EXPECTED_COUNTRY}. ${RED}Make sure to disable corporate VPN! ${NC}"
fi