import React from "react";
import { Field, Formik, Form } from 'formik';
import { TextField, DiagnosisSelection } from '../AddPatientModal/FormField';
import { OccupationalHealthcareEntry } from "../types";
import { Grid, Button } from "semantic-ui-react";
import { useStateValue } from "../state/state";

export type OccupationalHealthcareEntryFormValues = Omit<OccupationalHealthcareEntry, 'id'>;

interface Props {
  onSubmit: (values: OccupationalHealthcareEntryFormValues) => void;
  onCancel: () => void;
}

interface SickLeaveFormErrors {
  startDate?: string;
  endDate?: string;
}

interface AddOccupationalHealthcareEntryFormErrors {
  description?: string;
  date?: string;
  specialist?: string;
  employerName?: string;
  sickLeave?: SickLeaveFormErrors;
}
export const AddOccupationalHealthcareEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [{ diagnoses }] = useStateValue();
  return (
    <Formik
      initialValues={{
        description: "",
        date: "",
        specialist: "",
        employerName: "",
        sickLeave: {
          startDate: '',
          endDate: ''
        },
        diagnosisCodes: []
      }}
      onSubmit={values => onSubmit({ ...values, type: "OccupationalHealthcare" })}
      validate={values => {
        const requiredError = "Field is required";
        const invalidDate = "Invalid date";
        const errors: AddOccupationalHealthcareEntryFormErrors = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        } else if (!Date.parse(values.date)) {
          errors.date = invalidDate;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.employerName) {
          errors.employerName = requiredError;
        }
        if (values.sickLeave.startDate && !Date.parse(values.sickLeave.startDate)) {
          errors.sickLeave = { ...errors.sickLeave, startDate: invalidDate };
        }
        if (values.sickLeave.endDate && !Date.parse(values.sickLeave.endDate)) {
          errors.sickLeave = { ...errors.sickLeave, endDate: invalidDate };
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <Field
              label="Employer Name"
              placeholder="Employer Name"
              name="employerName"
              component={TextField}
            />
            <Field
              label="Sick Leave Start Date"
              placeholder="YYYY-MM-DD"
              name="sickLeave.startDate"
              component={TextField}
            />
            <Field
              label="Sick Leave End Date"
              placeholder="YYYY-MM-DD"
              name="sickLeave.endDate"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddOccupationalHealthcareEntryForm;