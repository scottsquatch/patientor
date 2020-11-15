import React from 'react';
import { useParams } from 'react-router-dom';
import { updatePatient, useStateValue } from '../state';
import { Header, Icon, List, Button } from 'semantic-ui-react';
import axios from 'axios';
import { Diagnosis, HealthCheckRating, Patient, HealthCheckEntry, OccupationalHealthcareEntry, HospitalEntry } from '../types';
import { apiBaseUrl } from '../constants';
import { Entry } from '../types';
import modals from '../AddEntryModal';
import { AddEntryFormValues } from '../AddEntryModal/index';


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

const Entries: React.FC<EntriesProps> = ({ entries }) => {
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
  const [modalOpen, setModalOpen] = React.useState<string>('');
  const [error, setError] = React.useState<string | undefined>();
  const [{ patients, diagnoses }, dispatch] = useStateValue();

  const openModal = (type: string): void => setModalOpen(type);

  const closeModal = (): void => {
    setModalOpen('');
    setError(undefined);
  };


  const submitNewEntry = async (values: AddEntryFormValues ) => {
    if (!patient) {
      return;
    }
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        { 
          ...values
        }
      );
      const updatedPatient: Patient = {
        ...patient,
        entries: [...patient.entries, newEntry]
      };
      dispatch(updatePatient(updatedPatient));
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };
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
    <modals.AddHealthCheckEntryModal
      modalOpen={modalOpen === 'HealthCheck'}
      onSubmit={submitNewEntry}
      error={error}
      onClose={closeModal}
    />
    <modals.AddOccupationalHealthcareEntryModal
      modalOpen={modalOpen === 'OccupationalHealthcare'}
      onSubmit={submitNewEntry}
      error={error}
      onClose={closeModal}
    />
    <modals.AddHospiitalEntry
      modalOpen={modalOpen === 'Hospital'}
      onSubmit={submitNewEntry}
      error={error}
      onClose={closeModal}
    />
    <Button onClick={() => openModal('HealthCheck')}>Add New Health Check Entry</Button>
    <Button onClick={() => openModal('OccupationalHealthcare')}>Add New Occupational Healthcare Entry</Button>
    <Button onClick={() => openModal('Hospital')}>Add New Hospital Entry</Button>
    <Entries 
      entries={patient.entries}
      diagnoses={diagnoses}
    />
  </div>);
};

export default PatientPage;
