"use client";

import { useActionState, useState } from "react";
import { update, UpdateState } from "@/app/actions/crud";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";


const initialState: UpdateState = { success: false, message: "" };

export default function EditForm({ record }: { record: any }) {
  const [name, setName] = useState(record.name);
  const [address, setAddress] = useState(record.address);
  const [dob, setDob] = useState(record.dob);
  const [comment, setComment] = useState(record.comment);
  const updateWithId = update.bind(null, record.id); // Bind the record ID to the update function
  const [state, formActionHere, isPending] = useActionState( updateWithId, initialState); //custom hook to manage form state and flash messages

  return (
    <>
      <form action={formActionHere}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Edit Page</FieldLegend>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="">Name</FieldLabel>
                <Input
                  id=""
                  placeholder=""
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {state.errors?.name && (
                  <p className="text-red-500 text-sm">{state.errors.name}</p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="">Address</FieldLabel>
                <Input
                  id=""
                  placeholder=""
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                {state.errors?.address && (
                  <p className="text-red-500 text-sm">{state.errors.address}</p>
                )}
                <FieldDescription>
                  Enter your 16-digit card number
                </FieldDescription>
              </Field>
              <div className="">
                <Field>
                  <FieldLabel htmlFor="">Date</FieldLabel>
                  <Input
                    type="date"
                    id=""
                    placeholder=""
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    name="dob"
                  />
                  {state.errors?.dob && (
                    <p className="text-red-500 text-sm">{state.errors.dob}</p>
                  )}
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />

          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="">Comments</FieldLabel>
                <Textarea
                  id=""
                  placeholder="Add any additional comments"
                  className="resize-none"
                  name="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  //   defaultValue={state.values?.comment}
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          {state.message && !state.success && (
            <p className="text-red-500 text-sm">{state.message}</p>
          )}

          <Field orientation="horizontal">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
            {/* <Button type="submit">Edit</Button> */}
          </Field>
        </FieldGroup>
      </form>
    </>
  );
}
