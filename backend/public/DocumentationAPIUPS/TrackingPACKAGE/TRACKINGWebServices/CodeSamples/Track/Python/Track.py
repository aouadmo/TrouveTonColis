import xml.etree.ElementTree as ET
from zeep import Client, Settings
from zeep.exceptions import Fault, TransportError, XMLSyntaxError

# Set Connection
settings = Settings(strict=False, xml_huge_tree=True)
client = Client('<WSDL Location>/Track.wsdl', settings=settings)

# Set SOAP headers
headers = {
    'UPSSecurity': {
        'UsernameToken': {
            'Username': '<Your username>',
            'Password': '<Your password>'
        },
        'ServiceAccessToken': {
            'AccessLicenseNumber': '<Your accesslicensenumber>'
        }
    }
}

# Create request dictionary
requestDictionary = {
    "RequestOption": "15",
    "SubVersion":"1707"
}
inquiryNumber = "<Tracking Number>"
trackingOption = "02"
upsLocale = "en_US"


# Try operation
try:
    response = client.service.ProcessTrack(_soapheaders=headers, Request=requestDictionary,
                                         InquiryNumber=inquiryNumber,TrackingOption=trackingOption,Locale=upsLocale)
    print(response)

except Fault as  error:
    print(ET.tostring(error.detail))


