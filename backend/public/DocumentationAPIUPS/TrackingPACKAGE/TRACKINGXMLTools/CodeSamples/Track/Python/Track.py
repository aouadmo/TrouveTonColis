import xml.etree.ElementTree as ET
import requests as req
import sys
#Create AccessRequest XML
_AccessLicenseNumber ='<Your access License Number>'
_userId = '<Your Userid>'
_password = '<Your password>'

AccessLicenseNumber = bytes(_AccessLicenseNumber, 'utf-8').decode('utf-8', 'ignore')
userId = bytes(_userId, 'utf-8').decode('utf-8', 'ignore')
password = bytes(_password, 'utf-8').decode('utf-8', 'ignore')
AccessRequest = ET.Element('AccessRequest')
ET.SubElement(AccessRequest,'AccessLicenseNumber').text = _AccessLicenseNumber
ET.SubElement(AccessRequest,'UserId').text = _userId
ET.SubElement(AccessRequest,'Password').text = _password


TrackToolsRequest = ET.Element('TrackRequest')
Request = ET.SubElement(TrackToolsRequest,'Request')
TransactionReference = ET.SubElement(Request,'TransactionReference')
ET.SubElement(TransactionReference,'CustomerContext').text = 'Customer context'
ET.SubElement(TransactionReference,'XpciVersion').text = '1.0'
ET.SubElement(Request,'RequestAction').text = 'Track'
ET.SubElement(Request,'RequestOption').text = 'none'
ET.SubElement(TrackToolsRequest,'TrackingNumber').text='<Tracking Number>'

_reqString = ET.tostring(AccessRequest)
print(_reqString)

tree = ET.ElementTree(ET.fromstring(_reqString))
root = tree.getroot()

_QuantunmRequest = ET.tostring(TrackToolsRequest)
quantunmTree = ET.ElementTree(ET.fromstring(_QuantunmRequest))
quantRoot = quantunmTree.getroot()

_XmlRequest = ET.tostring(root,encoding='utf8', method='xml') +ET.tostring(quantRoot,encoding='utf8', method='xml')
_XmlRequest = _XmlRequest.decode().replace('\n','')
print(_XmlRequest)
_host='https://onlinetools.ups.com/ups.app/xml/Track'
res = req.post(_host,_XmlRequest,verify=False)
print(res.content)

