import React from 'react';
import { useParams } from 'react-router-dom';
import { updatePatient, useStateValue } from '../state';
import { Header, Icon } from 'semantic-ui-react';
import axios from 'axios';
import { Patient } from '../types';
import { apiBaseUrl } from '../constants';

const PatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ patient, setPatient ] = React.useState<Patient | undefined>();
  const [{ patients }, dispatch] = useStateValue();
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
  </div>);
};

export default PatientPage;
