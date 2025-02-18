import React from 'react';
import {
  TextInput,
  SimpleForm,
  SelectInput,
  NumberInput,
  required,
  useTranslate,
  ReactAdminComponentProps,
  FormDataConsumer,
} from 'react-admin';

import {
  Language,
  TicketSystem,
} from '../../../api/generatedTypes/globalTypes';
import ImageUploadField from '../../../common/components/imageField/ImageUploadField';
import Aside from '../../../common/components/aside/Aside';
import useLanguageTabs from '../../../common/hooks/useLanguageTabs';
import KukkuuCreatePage from '../../application/layout/kukkuuCreatePage/KukkuuCreatePage';
import {
  validateCapacityPerOccurrence,
  validateDuration,
  validateEvent,
  validateParticipantsPerInvite,
  validateShortDescription,
} from '../validations';
import { participantsPerInviteChoices, ticketSystemChoices } from '../choices';
import { hasInternalTicketSystem } from '../utils';
import Config from '../../config';

const EventCreate = (props: ReactAdminComponentProps) => {
  const { location } = props;
  const eventGroupId = new URLSearchParams(location?.search).get(
    'eventGroupId'
  );
  const translate = useTranslate();
  const [
    languageTabsComponent,
    translatableField,
    selectedLanguage,
  ] = useLanguageTabs();

  const transform = (data: any) => {
    return {
      ...data,
      eventGroupId,
    };
  };

  const isAddingEventToEventGroup = Boolean(eventGroupId);
  const redirect = isAddingEventToEventGroup
    ? `/event-groups/${eventGroupId}/show`
    : 'show';

  return (
    <KukkuuCreatePage
      pageTitle={translate('events.create.title')}
      reactAdminProps={{
        ...props,
        aside: <Aside content="events.create.aside.content" />,
        transform,
      }}
    >
      <SimpleForm
        variant="outlined"
        redirect={redirect}
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        validate={validateEvent}
      >
        {languageTabsComponent}
        <ImageUploadField
          edit={true}
          source="image"
          image="image"
          helperText="events.fields.image.helperText"
        />
        <TextInput
          source={translatableField('imageAltText')}
          label="events.fields.imageAltText.label"
          helperText="events.fields.imageAltText.helperText"
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          validate={null}
          fullWidth
        />
        <TextInput
          source={translatableField('name')}
          label="events.fields.name.label"
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          validate={selectedLanguage === Language.FI ? required() : null}
          fullWidth
        />
        <TextInput
          source={translatableField('shortDescription')}
          label="events.fields.shortDescription.label"
          helperText="events.fields.shortDescription.helperText"
          validate={validateShortDescription}
          multiline
          fullWidth
        />
        <TextInput
          source={translatableField('description')}
          label="events.fields.description.label"
          helperText="events.fields.description.helperText"
          multiline
          fullWidth
        />
        <SelectInput
          source="participantsPerInvite"
          label="events.fields.participantsPerInvite.label"
          helperText="events.fields.participantsPerInvite.helperText"
          choices={participantsPerInviteChoices}
          validate={validateParticipantsPerInvite}
          fullWidth
        />
        {Config.featureFlagExternalTicketSystemSupport && (
          <SelectInput
            source="ticketSystem.type"
            label="events.fields.ticketSystem.label"
            choices={ticketSystemChoices}
            initialValue={TicketSystem.INTERNAL}
            fullWidth
          />
        )}
        <FormDataConsumer>
          {({ formData, ...rest }) =>
            hasInternalTicketSystem(formData) && (
              <NumberInput
                source="capacityPerOccurrence"
                label="events.fields.capacityPerOccurrence.label"
                helperText="events.fields.capacityPerOccurrence.helperText"
                validate={validateCapacityPerOccurrence}
                style={{ width: '100%' }}
                {...rest}
                // aria-describedby should be set automatically but it is not.
                // Seems like a bug related to FormDataConsumer.
                aria-describedby="capacityPerOccurrence-helper-text"
                id="capacityPerOccurrence"
              />
            )
          }
        </FormDataConsumer>
        <NumberInput
          source="duration"
          label="events.fields.duration.label"
          helperText="events.fields.duration.helperText"
          validate={validateDuration}
          fullWidth
        />
      </SimpleForm>
    </KukkuuCreatePage>
  );
};

export default EventCreate;
