import React from 'react';
import { Modal, Segment } from 'semantic-ui-react';
import AddHealthCheckEntryForm, { HealthCheckEntryFormValues }  from './AddHealthCheckEntryForm';
import AddOccupationalHealthcareEntryForm, { OccupationalHealthcareEntryFormValues } from './AddOccupationalHealthcareEntry';

export type AddEntryFormValues = HealthCheckEntryFormValues | OccupationalHealthcareEntryFormValues;

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: AddEntryFormValues) => void;
  error?: string;
}

const AddHealthCheckEntryModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
  <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
    <Modal.Header>Add a new Health Check Entry</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      <AddHealthCheckEntryForm onSubmit={onSubmit} onCancel={onClose} />
    </Modal.Content>
  </Modal>
);

const AddOccupationalHealthcareEntryModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
  <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
    <Modal.Header>Add a new Occupational Healthcare Entry</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      <AddOccupationalHealthcareEntryForm onSubmit={onSubmit} onCancel={onClose} />
    </Modal.Content>
  </Modal>
);

export default { 
  AddHealthCheckEntryModal,
  AddOccupationalHealthcareEntryModal
};