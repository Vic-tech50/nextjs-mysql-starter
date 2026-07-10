"use client";

import { useState } from "react";
import { update } from "@/app/actions/crud";
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

export default function EditForm({ record }: { record: any }) {
  const [name, setName] = useState(record.name);
  const [address, setAddress] = useState(record.address);
  const [dob, setDob] = useState(record.dob);
  const [comment, setComment] = useState(record.comment);

  return (
    <>
      <form action={update.bind(null, record.id)}>
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
                {/* {state.errors?.name && (
                      <p className="text-red-500 text-sm">
                        {state.errors.name}
                      </p>
                    )} */}
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
                {/* {state.errors?.address && (
                      <p className="text-red-500 text-sm">
                        {state.errors.address}
                      </p>
                    )} */}
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
                  {/* {state.errors?.dob && (
                        <p className="text-red-500 text-sm">
                          {state.errors.dob}
                        </p>
                      )} */}
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
          <Field orientation="horizontal">
            <Button type="submit">Edit</Button>
          </Field>
        </FieldGroup>
      </form>
    </>
  );
}
