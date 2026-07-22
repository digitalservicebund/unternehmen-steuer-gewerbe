import { fetchJson } from "../../helpers/fetchJson";
import { PVOG_SUCHDIENST_API_URL } from "./constants";

const GEWERBEANMELDUNG_LEIKA_ID = "99050012104000";
// see https://www.xrepository.de/details/urn:de:xzufi:codeliste:zustaendigkeitsrolle
const ROLE_CODE_ZUSTAENDIGE_STELLE_UND_ANSPRECHPUNKT = "01";
const ROLE_CODE_ZUSTAENDIGE_STELLE = "02";
// see https://www.xrepository.de/details/urn:xoev-de:fim:codeliste:xzufi.anschrifttyp
const ADDRESS_TYPE_CODE_HAUSANSCHRIFT = "001";
const COMMUNICATION_CODE_EMAIL = "01";
const COMMUNICATION_CODE_TELEFON = "02";

export interface GewerbeamtAdresse {
  strasse?: string;
  hausnummer?: string;
  postleitzahl?: string;
  ort?: string;
}

export interface OnlineServiceLink {
  title?: string;
  description?: string;
  uri: string;
}

export interface Gewerbeamt {
  name: string;
  adresse?: GewerbeamtAdresse;
  telefon?: string;
  email?: string;
  onlineServices: OnlineServiceLink[];
}

interface ServiceDescription {
  id: string;
  ars: string[];
}

interface ServiceDescriptionsResponse {
  content: ServiceDescription[];
}

interface ServiceDescriptionDetail {
  onlineServiceLinks: OnlineServiceLink[];
}

interface OrganisationUnitRole {
  code: string;
  name: string;
}

interface OrganisationUnitTitle {
  id: string;
  title: string;
  role?: OrganisationUnitRole;
}

interface OrganisationUnitAddress {
  street?: string;
  houseNumber?: string;
  zip?: string;
  city?: string;
  code?: string;
}

interface OrganisationUnitCommunication {
  code: string;
  value: string;
}

interface OrganisationUnitLocation {
  addresses: OrganisationUnitAddress[];
  communications: OrganisationUnitCommunication[];
}

interface OrganisationUnitDetail {
  title: string;
  location: OrganisationUnitLocation;
}

function toAdresse(addresses: OrganisationUnitAddress[]): GewerbeamtAdresse | undefined {
  const address =
    addresses.find((candidate) => {
      return candidate.code === ADDRESS_TYPE_CODE_HAUSANSCHRIFT;
    }) ?? addresses[0];

  if (address === undefined) {
    return undefined;
  }

  return {
    strasse: address.street?.trim(),
    hausnummer: address.houseNumber?.trim(),
    postleitzahl: address.zip?.trim(),
    ort: address.city?.trim(),
  };
}

// A service description may apply to a whole federal state while another one applies to the searched
// municipality itself. FITKO recommends using the one whose ARS matches the searched ARS most precisely.
// See https://docs.fitko.de/efa-parametrisierung/docs/parametrisierung_anh%C3%A4nge/ermittlung_der_id_der_leistungsbeschreibung
function findServiceDescriptionWithMostPreciseArs(
  serviceDescriptions: ServiceDescription[],
  searchedArs: string,
): ServiceDescription | undefined {
  let bestMatch: ServiceDescription | undefined;
  let bestPrecision = -1;

  for (const candidate of serviceDescriptions) {
    const precision = getArsMatchPrecision(candidate, searchedArs);
    if (precision > bestPrecision) {
      bestMatch = candidate;
      bestPrecision = precision;
    }
  }

  return bestMatch;
}

// The ARS is hierarchical: its digits encode federal state, government district, county and
// municipality from left to right. So the more leading digits a service description's ARS shares
// with the searched ARS, the closer its administrative level is to the searched municipality.
// A service description carries a list of ARS values; its precision is the best match among them.
function getArsMatchPrecision(serviceDescription: ServiceDescription, searchedArs: string): number {
  const precisions = serviceDescription.ars.map((candidateArs) => {
    // the number of matching leading digits is the index of the first mismatching digit
    const indexOfFirstMismatch = [...searchedArs].findIndex(
      (digit, index) => candidateArs[index] !== digit,
    );
    return indexOfFirstMismatch === -1 ? searchedArs.length : indexOfFirstMismatch;
  });

  return Math.max(0, ...precisions);
}

// FITKO recommends treating units without a role element or with role code 01/02 as responsible, see
// https://docs.fitko.de/efa-parametrisierung/docs/parametrisierung_anh%C3%A4nge/ermittlung_zust%C3%A4ndige_organisationseinheit_im_pvog/
function isZustaendigeStelle(unit: OrganisationUnitTitle): boolean {
  if (unit.role === undefined) return true;
  return (
    unit.role.code === ROLE_CODE_ZUSTAENDIGE_STELLE_UND_ANSPRECHPUNKT ||
    unit.role.code === ROLE_CODE_ZUSTAENDIGE_STELLE
  );
}

function findCommunicationValue(
  communications: OrganisationUnitCommunication[],
  code: string,
): string | undefined {
  return communications.find((communication) => communication.code === code)?.value;
}

export async function fetchServiceDescriptions(
  ars: string,
): Promise<ServiceDescriptionsResponse> {
  const validDate = new Date().toISOString().split("T")[0]!;
  return fetchJson<ServiceDescriptionsResponse>(
    `${PVOG_SUCHDIENST_API_URL}/v3/servicedescriptions/leikaid`,
    { params: { ars, leikaIds: GEWERBEANMELDUNG_LEIKA_ID, page: 0, size: 10, validDate } },
  );
}

export async function fetchServiceDescriptionDetail(
  lbId: string,
  ars: string,
): Promise<ServiceDescriptionDetail> {
  return fetchJson<ServiceDescriptionDetail>(
    `${PVOG_SUCHDIENST_API_URL}/v6/servicedescriptions/${lbId}/detail`,
    { params: { ars } },
  );
}

export async function fetchOrganisationUnitTitles(
  ars: string,
  lbId: string,
): Promise<OrganisationUnitTitle[]> {
  const validDate = new Date().toISOString().split("T")[0]!;
  return fetchJson<OrganisationUnitTitle[]>(
    `${PVOG_SUCHDIENST_API_URL}/v2/organisationunits/titles`,
    { params: { ars, lbId, validDate } },
  );
}

export async function fetchOrganisationUnitDetail(
  ars: string,
  lbId: string,
  organisationUnitId: string,
): Promise<OrganisationUnitDetail> {
  const validDate = new Date().toISOString().split("T")[0]!;
  return fetchJson<OrganisationUnitDetail>(
    `${PVOG_SUCHDIENST_API_URL}/v5/organisationunits/detail`,
    { params: { ars, lbId, q: organisationUnitId, validDate } },
  );
}

export async function getGewerbeamt(ars: string): Promise<Gewerbeamt | undefined> {
  const serviceDescriptions = await fetchServiceDescriptionsByArs(ars);
  const serviceDescription = findServiceDescriptionWithMostPreciseArs(
    serviceDescriptions.content,
    ars,
  );
  if (serviceDescription === undefined) {
    return undefined;
  }
  const lbId = serviceDescription.id;

  const serviceDescriptionDetail = await fetchServiceDescriptionDetail(lbId, ars);

  const organisationUnits = await fetchOrganisationUnitTitles(ars, lbId);
  // falling back to the first unit equals FITKO's recommended fallback to role 03 (Ansprechpunkt),
  // since the role code list only contains the codes 01, 02 and 03
  const organisationUnit = organisationUnits.find(isZustaendigeStelle) ?? organisationUnits[0];

  if (organisationUnit === undefined) {
    throw new Error(`No organisation unit found for ARS ${ars} and lbId ${lbId}`);
  }

  const detail = await fetchOrganisationUnitDetail(ars, lbId, organisationUnit.id);

  return {
    name: detail.title.trim(),
    adresse: toAdresse(detail.location.addresses),
    telefon: findCommunicationValue(
      detail.location.communications,
      COMMUNICATION_CODE_TELEFON,
    )?.trim(),
    email: findCommunicationValue(detail.location.communications, COMMUNICATION_CODE_EMAIL)?.trim(),
    // map explicitly so additional response fields (id, validity periods, ...) don't leak through
    onlineServices: serviceDescriptionDetail.onlineServiceLinks.map(
      ({ title, description, uri }) => ({
        title: title?.trim(),
        description: description?.trim(),
        uri: uri.trim(),
      }),
    ),
  };
}
