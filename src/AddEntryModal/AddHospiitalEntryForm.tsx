import React from "react";
import { Field, Formik, Form } from 'formik';
import { TextField, DiagnosisSelection } from '../AddPatientModal/FormField';
import { HospitalEntry } from "../types";
import { Grid, Button } from "semantic-ui-react";
import { useStateValue } from "../state/state";

export type HospitalEntryFormValues = Omit<HospitalEntry, 'id'>;

interface Props {
  onSubmit: (values: HospitalEntryFormValues) => void;
  onCancel: () => void;
}

interface HospitalDischargeErrors {
  date?: string;
  criteria?: string;
}

interface AddHospitalEntryFormErrors {
  description?: string;
  date?: string;
  specialist?: string;
  discharge?: HospitalDischargeErrors;
}
export const AddHospitalEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [{ diagnoses }] = useStateValue();
  return (
    <Formik
      initialValues={{
        description: "",
        date: "",
        specialist: "",
        discharge: {
          date: '',
          criteria: ''
        },
        diagnosisCodes: []
      }}
      onSubmit={values => onSubmit({ ...values, type: "Hospital" })}
      validate={values => {
        const requiredError = "Field is required";
        const invalidDate = "Invalid date";
        const errors: AddHospitalEntryFormErrors = {};
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
        if (values.discharge.date && !Date.parse(values.discharge.date)) {
          errors.discharge = { ...errors.discharge, date: invalidDate };
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
              label="Hospital Discharge Date"
              placeholder="YYYY-MM-DD"
              name="discharge.date"
              component={TextField}
            />
            <Field
              label="Hospital Discharge Criteria"
              placeholder="Hospital Discharge Crtieria"
              name="discharge.criteria"
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

export default AddHospitalEntryForm;