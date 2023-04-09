import { useState } from "react";
import { Form, ActionPanel, Action, Toast, popToRoot, Icon } from "@raycast/api";
import ampStart from "./amp-start";

enum Intervals {
  "hours" = "1",
}

export default function SessionWithDuration() {
  const [interval, setInterval] = useState<keyof typeof Intervals>("hours");
  const [duration, setDuration] = useState<string>(Intervals[interval]);

  const toast = new Toast({
    title: "Starting New Session",
    style: Toast.Style.Animated,
  });

  async function submit() {
    toast.show();

    const convertedDuration = Number(duration);
    if (Number.isNaN(convertedDuration)) {
      toast.title = "Failed to initialize a session.";
      toast.message = "The duration is invalid";
      toast.style = Toast.Style.Failure;
    } else {
      let started = false;
      if (!duration) {
        started = await ampStart();
      } else {
        started = await ampStart({ duration: convertedDuration });
      }
      if (started) popToRoot();
    }
  }

  function handleChangeDuration(newInterval: keyof typeof Intervals) {
    if (interval !== newInterval) {
      setInterval(newInterval);
      setDuration(Intervals[newInterval]);
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Start Session"
            onSubmit={submit}
            shortcut={{ key: "enter", modifiers: [] }}
            icon={Icon.List}
          />
          <Action
            title="Select Hours"
            onAction={() => handleChangeDuration("hours")}
            shortcut={{ key: "h", modifiers: ["cmd"] }}
            icon={Icon.Clock}
          />
        </ActionPanel>
      }
      navigationTitle="Configure Session"
    >
      <Form.TextField
        id="duration"
        title={`Duration (in ${interval})`}
        info={`Sets the session duration based on the unit selected.\n\nCurrent: ${duration} ${
          duration === "1" ? interval.substring(0, interval.length - 1) : interval
        }`}
        value={duration}
        onChange={(value) => setDuration(value)}
      />
    </Form>
  );
}
