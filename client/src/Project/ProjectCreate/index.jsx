import React from 'react';
import PropTypes from 'prop-types';

import toast from 'shared/utils/toast';
import useApi from 'shared/hooks/api';
import useCurrentUser from 'shared/hooks/currentUser';
import { Form, IssueTypeIcon, Icon, Avatar, IssuePriorityIcon } from 'shared/components';

import {
  FormHeading,
  FormElement,
  SelectItem,
  SelectItemLabel,
  Divider,
  Actions,
  ActionButton,
} from './Styles';
import { ProjectCategory, ProjectCategoryCopy } from 'shared/constants/projects';

const propTypes = {
  users: PropTypes.object.isRequired,
  fetchUser: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
};

const ProjectCreate = async ({ users, fetchUser, onCreate, modalClose }) => {
  const [{ isCreating }, createProject] = useApi.post('/project');
  await fetchUser();
  const { currentUserId } = useCurrentUser();

  return (
    <Form
      enableReinitialize
      initialValues={{
        name: '',
        url: `http://arena.soloo.me/${currentUserId}`,
        description: '',
        userIds: [currentUserId],
        category: ProjectCategory.SOFTWARE,
      }}
      validations={{
        name: Form.is.required(),
        url: [Form.is.required(), Form.is.url()],
        category: Form.is.required(),
        category: Form.is.required(),
      }}
      onSubmit={async (values, form) => {
        try {
          await createProject({
            ...values,
            users: values.userIds.map(id => ({ id })),
          });
          await fetchProject();
          toast.success('Project has been successfully created.');
          onCreate();
        } catch (error) {
          Form.handleAPIError(error, form);
        }
      }}
    >
      <FormElement>
        <FormHeading>Create Project</FormHeading>

        <Form.Field.Input name="name" label="Project Name" tip="The project name." />
        <Form.Field.TextEditor
          name="description"
          label="Description"
          tip="Describe the issue in as much detail as you'd like."
        />
        <Form.Field.Input
          name="url"
          label="Project Url"
          tip="The url for accessing this project."
        />

        <Form.Field.Select
          isMulti
          name="userIds"
          label="Assignees"
          tio="People who are responsible for dealing with this issue."
          options={userOptions(users)}
          renderOption={renderUser(users)}
          renderValue={renderUser(users)}
        />
        <Form.Field.Select
          name="category"
          label="Category"
          tip="The project's category"
          options={categoryOptions}
          renderOption={renderCategory}
          renderValue={renderCategory}
        />
        <Actions>
          <ActionButton type="submit" variant="primary" isWorking={isCreating}>
            Create Project
          </ActionButton>
          <ActionButton type="button" variant="empty" onClick={modalClose}>
            Cancel
          </ActionButton>
        </Actions>
      </FormElement>
    </Form>
  );
};

const categoryOptions = Object.values(ProjectCategory).map(type => ({
  value: type,
  label: ProjectCategoryCopy[type],
}));

const userOptions = users => users.map(user => ({ value: user.id, label: user.name }));

const renderCategory = ({ value: category }) => (
  <SelectItem>
    <IssueTypeIcon type={category} top={1} />
    <SelectItemLabel>{ProjectCategoryCopy[category]}</SelectItemLabel>
  </SelectItem>
);

const renderUser = user => ({ value: userId, removeOptionValue }) => {
  const user = users.find(({ id }) => id === userId);

  return (
    <SelectItem
      key={user.id}
      withBottomMargin={!!removeOptionValue}
      onClick={() => removeOptionValue && removeOptionValue()}
    >
      <Avatar size={20} avatarUrl={user.avatarUrl} name={user.name} />
      <SelectItemLabel>{user.name}</SelectItemLabel>
      {removeOptionValue && <Icon type="close" top={2} />}
    </SelectItem>
  );
};

ProjectCreate.propTypes = propTypes;

export default ProjectCreate;
