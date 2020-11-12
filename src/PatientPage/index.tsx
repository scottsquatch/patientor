import React from 'react';
import { useParams } from 'react-router-dom';
import { updatePatient, useStateValue } from '../state';
import { Header, Icon } from 'semantic-ui-react';
import axios from 'axios';
import { Diagnosis, Patient } from '../types';
import { apiBaseUrl } from '../constants';
import { Entry } from '../types';

interface EntriesProps {
  entries: Array<Entry>;
  diagnoses: { [code: string]: Diagnosis };
}
const Entries: React.FC<EntriesProps> = ({ entries, diagnoses }) => {
  return (
    <>
      <Header as="h3">entries</Header>
      {entries.map(entry => {
      return (<div key={entry.id}>
        <p>{entry.date} {entry.description}</p>
        {entry.diagnosisCodes && (<ul>{entry.diagnosisCodes.map(dc => <li key={dc}>{dc} {diagnoses[dc].name}</li>)}</ul>)}
      </div>);
      })}
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
