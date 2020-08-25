const crypto = require('crypto');
const nitCufe = '12107199';
const claveCUFE = 'dd85db55545bd6566f36b0fd3be9fd8555c36e';

const resolucion = {
    autorizacion: '18762009413155',
    fechaInicio: '2018-07-27',
    fechaFin: '2020-01-27',
    prefijo: 'PRUE',
    numeroInicio: '98000001',
    numeroFin: '99000000',
    providerId: '890321151',
    softwareId: '9647c6c3-3185-4f8e-80ff-586a2fd5c050',
    softwareCodigo: 'fb3dde60868bf9603e281afd81be5bcb560ffe2c1f1c3e12a094ad3ee4eca74f74f96e9861ad0d623aea5e2a73f1f7d6'
};

const fechaCufe = function(fecha) {
    return fecha.getFullYear() +
        pad2(fecha.getMonth() + 1) +
        pad2(fecha.getDate()) +
        pad2(fecha.getHours()) +
        pad2(fecha.getMinutes()) +
        pad2(fecha.getSeconds());
}

const pad2 = function(n) { // always returns a string
    return (n < 10 ? '0' : '') + n;
}

const precioToString = function(precio) {
    var precioString = precio.toString();
    var a = precioString.split('.');

    if (a[1]) {
        if (a[1].length === 1) {
            a[1] = a[1] + '0';
        }
    } else {
        a[1] = '00';
    }

    var b = a.join('.');

    return b;
}

module.exports.cabeceraXML = `<?xml version="1.0" encoding="UTF-8"?>
<fe:Invoice xmlns:fe="http://www.dian.gov.co/contratos/facturaelectronica/v1" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:clm54217="urn:un:unece:uncefact:codelist:specification:54217:2001" xmlns:clm66411="urn:un:unece:uncefact:codelist:specification:66411:2001" xmlns:clmIANAMIMEMediaType="urn:un:unece:uncefact:codelist:specification:IANAMIMEMediaType:2003" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:qdt="urn:oasis:names:specification:ubl:schema:xsd:QualifiedDatatypes-2" xmlns:sts="http://www.dian.gov.co/contratos/facturaelectronica/v1/Structures" xmlns:udt="urn:un:unece:uncefact:data:specification:UnqualifiedDataTypesSchemaModule:2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.dian.gov.co/contratos/facturaelectronica/v1 ../xsd/DIAN_UBL.xsd urn:un:unece:uncefact:data:specification:UnqualifiedDataTypesSchemaModule:2 ../../ubl2/common/UnqualifiedDataTypeSchemaModule-2.0.xsd urn:oasis:names:specification:ubl:schema:xsd:QualifiedDatatypes-2 ../../ubl2/common/UBL-QualifiedDatatypes-2.0.xsd">
<ext:UBLExtensions>`;

module.exports.primeraExtension = `<ext:UBLExtension>
<ext:ExtensionContent>
    <sts:DianExtensions>
        <sts:InvoiceControl>
            <sts:InvoiceAuthorization>${resolucion.autorizacion}</sts:InvoiceAuthorization>
            <sts:AuthorizationPeriod>
                <cbc:StartDate>${resolucion.fechaInicio}</cbc:StartDate>
                <cbc:EndDate>${resolucion.fechaFin}</cbc:EndDate>
            </sts:AuthorizationPeriod>
            <sts:AuthorizedInvoices>
                <sts:Prefix>${resolucion.prefijo}</sts:Prefix>
                <sts:From>${resolucion.numeroInicio}</sts:From>
                <sts:To>${resolucion.numeroFin}</sts:To>
            </sts:AuthorizedInvoices>
        </sts:InvoiceControl>
        <sts:InvoiceSource>
            <cbc:IdentificationCode listAgencyID="6" listAgencyName="United Nations Economic Commission for Europe" listSchemeURI="urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.0">CO</cbc:IdentificationCode>
        </sts:InvoiceSource>
        <sts:SoftwareProvider>
            <sts:ProviderID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)">${resolucion.providerId}</sts:ProviderID>
            <sts:SoftwareID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)">${resolucion.softwareId}</sts:SoftwareID>
        </sts:SoftwareProvider>
        <sts:SoftwareSecurityCode schemeAgencyID="195" schemeAgencyName="CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)">${resolucion.softwareCodigo}</sts:SoftwareSecurityCode>
    </sts:DianExtensions>
</ext:ExtensionContent>
</ext:UBLExtension>`;

module.exports.extensionFirma = `<ext:UBLExtension>
<ext:ExtensionContent></ext:ExtensionContent>
</ext:UBLExtension>`;

module.exports.cierreExtensiones = `</ext:UBLExtensions>`;

module.exports.cierreFactura = `</fe:Invoice>`;

module.exports.cbcUBLVersionID = `<cbc:UBLVersionID>UBL 2.0</cbc:UBLVersionID>`;

module.exports.cbcProfileID = `<cbc:ProfileID>DIAN 1.0</cbc:ProfileID>`;

module.exports.cbcID = (numeroDeFactura) => `<cbc:ID>${numeroDeFactura}</cbc:ID>`;

module.exports.cbcUUID = (NumFac, FecFac, ValFac, ValTotal, ValIva, clienteId) => {
    let numero = NumFac.split("PRUE")[1];
    let fecha = fechaCufe(FecFac);
    let sinIva = precioToString(ValFac);
    let iva = precioToString(ValIva);
    let total = precioToString(ValTotal);
    let numeroCliente = clienteId;
    // console.log({ numero, fecha, sinIva, iva, total });

    let cadenaCufe = numero + '.' +
        fecha + '.' +
        sinIva + '.01.' +
        iva + '.02.0.00.03.0.00.' +
        total + '.' +
        nitCufe + '.' +
        '31' + '.' +
        numeroCliente + '.' +
        claveCUFE;

    const hash = crypto.createHash('sha1');
    hash.update(cadenaCufe);
    const CUFE = hash.digest('hex');
    // console.log({ cufe: CUFE });

    return `<cbc:UUID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)">${CUFE}</cbc:UUID>`;
}

module.exports.cbcIssueDate = (fechaFactura) => {

    let fecha = new Date(fechaFactura.getTime() - (fechaFactura.getTimezoneOffset() * 60000))
        .toISOString()
        .split('T')[0];

    return `<cbc:IssueDate>${fecha}</cbc:IssueDate>`;
}

module.exports.cbcIssueTime = (fechaFactura) => {

    let hora = fechaFactura.toLocaleTimeString();

    return `<cbc:IssueTime>${hora}</cbc:IssueTime>`;
}

module.exports.tipoDefacturaMoneda = `<cbc:InvoiceTypeCode listAgencyID="195" listAgencyName="CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)" listSchemeURI="http://www.dian.gov.co/contratos/facturaelectronica/v1/InvoiceType">1</cbc:InvoiceTypeCode>
<cbc:DocumentCurrencyCode>COP</cbc:DocumentCurrencyCode>`;

module.exports.infoEmpresa = `<fe:AccountingSupplierParty>
<cbc:AdditionalAccountID>1</cbc:AdditionalAccountID>
<fe:Party>
<cac:PartyIdentification>
    <cbc:ID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)" schemeID="31">12107199</cbc:ID>
</cac:PartyIdentification>
<fe:PhysicalLocation>
    <fe:Address>
        <cbc:Department>HUILA</cbc:Department>
        <cbc:CityName>NEIVA</cbc:CityName>
        <cac:AddressLine>
            <cbc:Line>Carrera 3 # 9-101</cbc:Line>
        </cac:AddressLine>
        <cac:Country>
            <cbc:IdentificationCode>CO</cbc:IdentificationCode>
        </cac:Country>
    </fe:Address>
</fe:PhysicalLocation>
<fe:PartyTaxScheme>
    <cbc:TaxLevelCode>2</cbc:TaxLevelCode>
    <cac:TaxScheme />
</fe:PartyTaxScheme>
<fe:PartyLegalEntity>
    <cbc:RegistrationName>Universal de Licuadoras</cbc:RegistrationName>
</fe:PartyLegalEntity>
</fe:Party>
</fe:AccountingSupplierParty>`;

module.exports.infoCliente = (cliente) => {

    console.log(cliente);

    const cbcAdditionalAccountID = cliente.tipoId === 'cc' ? 2 : 1;

    return `<fe:AccountingCustomerParty>
    <cbc:AdditionalAccountID>${cbcAdditionalAccountID}</cbc:AdditionalAccountID>
    <fe:Party>
        <cac:PartyIdentification>
            <cbc:ID schemeAgencyID="195" schemeAgencyName="CO, DIAN (Direccion de Impuestos y Aduanas Nacionales)" schemeID="13">${cliente.numeroId}</cbc:ID>
        </cac:PartyIdentification>
        <fe:PhysicalLocation>
            <fe:Address>
                <cbc:Department>${cliente.departamento}</cbc:Department>
                <cbc:CityName>${cliente.ciudad}</cbc:CityName>
                <cac:AddressLine>
                    <cbc:Line>${cliente.direccion}</cbc:Line>
                </cac:AddressLine>
                <cac:Country>
                    <cbc:IdentificationCode>CO</cbc:IdentificationCode>
                </cac:Country>
            </fe:Address>
        </fe:PhysicalLocation>
        <fe:PartyTaxScheme>
            <cbc:TaxLevelCode>O-99</cbc:TaxLevelCode>
            <cac:TaxScheme />
        </fe:PartyTaxScheme>
        <fe:Person>
            <cbc:FirstName>${cliente.nombre}</cbc:FirstName>
            <cbc:FamilyName>${cliente.apellidos}</cbc:FamilyName>
        </fe:Person>
    </fe:Party>
</fe:AccountingCustomerParty>`;
}