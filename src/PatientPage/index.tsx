import React from 'react';
import { useParams } from 'react-router-dom';
import { updatePatient, useStateValue } from '../state';
import { Header, Icon, List } from 'semantic-ui-react';
import axios from 'axios';
import { Diagnosis, HealthCheckRating, Patient, HealthCheckEntry, OccupationalHealthcareEntry, HospitalEntry } from '../types';
import { apiBaseUrl } from '../constants';
import { Entry, } from '../types';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const HospitalEntryDetail: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
  return (
    <div>
      <Header as="h4">{entry.date} <Icon name="hospital" /></Header>
      <p>{entry.description}</p>
    </div>
  );
};

const OccupationalHealthcareEntryDetail: React.FC<{ entry: OccupationalHealthcareEntry }> = ({ entry }) => {
   return (
    <div>
      <Header as="h4">{entry.date} <Icon name="stethoscope" /> {entry.employerName}</Header>
      <p>{entry.description}</p>
    </div>
  );
};

const HealthCheckEntryDetail: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
  const HealthRatingIcon: React.FC<{ rating: HealthCheckRating }> = ({ rating }) => {
    switch (rating) {
      case HealthCheckRating.CriticalRisk: 
        return <Icon name='heart' color="red" />;
      case HealthCheckRating.Healthy:
        return <Icon name='heart' color='green' />;
      case HealthCheckRating.HighRisk:
        return <Icon name='heart' color='orange' />;
      case HealthCheckRating.LowRisk:
        return <Icon name='heart' color='yellow' />;
    }
  };

  return (
    <div>
      <Header as="h4">{entry.date} <Icon name="doctor" /></Header>
      <p style={{ color: 'grey' }}>{entry.description}</p>
      <HealthRatingIcon rating={entry.healthCheckRating} />
    </div>
  );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch(entry.type) {
    case 'Hospital':
      return <HospitalEntryDetail entry={entry} />;
    case 'OccupationalHealthcare':
      return <OccupationalHealthcareEntryDetail entry={entry} />;
    case 'HealthCheck':
      return <HealthCheckEntryDetail entry={entry} />;
    default:
      return assertNever(entry);
  }
};

interface EntriesProps {
  entries: Array<Entry>;
  diagnoses: { [code: string]: Diagnosis };
}

const Entries: React.FC<EntriesProps> = ({ entries, diagnoses }) => {
  return (
    <>
      <Header as="h3">entries</Header>
      <List celled>
        {entries.map(entry => {
          return (
            <List.Item key={entry.id}>
              <EntryDetails entry={entry} />
            </List.Item>);
        })}
      </List>
    </>
  );
};

const PatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ patient, setPatient ] = React.useState<Patient | undefined>();
  const [{ patients, diagnoses }, dispatch] = useStateValue();
  React.useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        dispatch(updatePatient(patientFromApi));
        setPatient(patientFromApi);
      } catch (e) {
        console.error(e);
      }
    };
    const existingPatient = patients[id];
    if (!existingPatient || !existingPatient.ssn) {
      fetchPatientInfo();
    } else {
      setPatient(existingPatient);
    }
  }, [dispatch, patients, id]);

  if (!patient) {
    return (<div>loading...</div>);
  }

  const GenderIcon: React.FC = () => {
    switch (patient.gender) {
      case "male":
        return <><Icon name="mars" /></>;
      case "female":
        return <><Icon name="venus" /></>;
      case "other":
        return <><Icon name="genderless" /></>;
      default:
        return null;
    }
  };
  return (<div>
    <Header as="h2">{patient.name}
      <GenderIcon /></Header>
    <p>
      ssn: {patient.ssn}<br />
      occupation: {patient.occupation}<br />
      date of birth: {patient.dateOfBirth}
    </p>
    <Entries 
      entries={patient.entries}
      diagnoses={diagnoses}
    />
  </div>);
};

export default PatientPage;
