import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

const AddNoteForm = ({ pokemonId, onSave, goBack }) => {
  const today = new Date().toISOString().split("T")[0];
  const validationSchema = Yup.object().shape({
    tacticName: Yup.string()
      .required("Wymagane")
      .min(5, "Minimalna długość to 5 znaków")
      .max(50, "Maksymalna długość to 50 znaków"),
    strategy: Yup.string()
      .required("Wymagane")
      .min(10, "Minimalna długość to 10 znaków"),
    effectiveness: Yup.number()
      .min(1, "Minimalna wartość to 1")
      .max(5, "Maksymalna wartość to 5"),
    conditions: Yup.string().min(10, "Minimalna długość to 10 znaków"),
    trainingDate: Yup.date()
      .required("Wymagane")
      .max(today, "Data nie może być w przyszłości"),
    opponents: Yup.array().nullable(),
  });

  const handleSubmit = (values) => {
    const note = {
      ...values,
      id: crypto.randomUUID(),
      pokemonId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(note);
  };

  return (
    <Formik
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      initialValues={{
        tacticName: "",
        strategy: "",
        effectiveness: 1,
        conditions: "",
        trainingDate: "",
        opponents: [],
      }}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <div>
            <label>Nazwa taktyki:</label>
            <Field name="tacticName" />
            <ErrorMessage
              name="tacticName"
              component="span"
              style={{
                color: "red",
                textDecoration: "underline",
                fontWeight: "bold",
                marginLeft: "10px",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <label>Opis strategii:</label>
            <Field name="strategy" as="textarea" />
            <ErrorMessage
              name="strategy"
              component="span"
              style={{
                color: "red",
                textDecoration: "underline",
                fontWeight: "bold",
                marginLeft: "10px",
              }}
            />
          </div>

          <div>
            <label>Skuteczność:</label>
            <Field name="effectiveness" as="select">
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="effectiveness"
              component="span"
              style={{
                color: "red",
                textDecoration: "underline",
                fontWeight: "bold",
                marginLeft: "10px",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <label>Warunki użycia:</label>
            <Field name="conditions" as="textarea" />
            <ErrorMessage
              name="conditions"
              component="span"
              style={{
                color: "red",
                textDecoration: "underline",
                fontWeight: "bold",
                marginLeft: "10px",
              }}
            />
          </div>

          <div>
            <label>Data treningu:</label>
            <Field name="trainingDate" type="date" />
            <ErrorMessage
              name="trainingDate"
              component="span"
              style={{
                color: "red",
                textDecoration: "underline",
                fontWeight: "bold",
                marginLeft: "10px",
              }}
            />
          </div>

          <div>
            <label>Przeciwnicy:</label>
            <div role="group" aria-labelledby="opponents">
              {[
                "fire",
                "water",
                "grass",
                "electric",
                "ground",
                "normal",
                "flying",
                "poison",
                "rock",
                "bug",
                "ghost",
                "steel",
                "psychic",
                "ice",
                "dragon",
                "dark",
                "fairy",
              ].map((type) => (
                <div key={type}>
                  <Field
                    type="checkbox"
                    name="opponents"
                    value={type}
                    checked={values.opponents.includes(type)}
                    onChange={(e) => {
                      const selectedValues = e.target.checked
                        ? [...values.opponents, type]
                        : values.opponents.filter((value) => value !== type);
                      setFieldValue("opponents", selectedValues);
                    }}
                  />
                  <label htmlFor={type}>{type}</label>
                </div>
              ))}
            </div>
            <ErrorMessage
              name="opponents"
              component="span"
              style={{
                color: "red",
                textDecoration: "underline",
                fontWeight: "bold",
                marginLeft: "10px",
              }}
            />
          </div>

          <div>
            <button type="submit">Dodaj notatkę</button>
            <button type="button" onClick={() => goBack()}>
              Wróć
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddNoteForm;
