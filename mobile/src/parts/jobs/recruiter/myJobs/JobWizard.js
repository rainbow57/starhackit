import React from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import glamorous from "glamorous-native";
import _ from "lodash";

export default context => {
  const AutoCompleteLocation = require("components/AutoCompleteLocation").default(
    context
  );

  const JobInfo = require("./JobInfo").default(context);
  const JobPicture = require("./JobPicture").default(context);
  const SectorList = require("components/SectorList").default(context);
  const JobEdit = require("./JobEdit").default(context);
  const CompanyInfo = require("./CompanyInfo").default(context);
  const DateItem = require("./Dates").default(context);

  const Header = glamorous.view({
    padding: 10,
    marginBottom: 8,
    backgroundColor: "white",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  });

  const HeaderTitle = glamorous.text({
    fontWeight: "bold",
    fontSize: 18
  });

  const wizardConfig = {
    header: ({
      title,
      isFirst,
      onPrevious,
      isLast,
      onNext,
      nextAllowed = true
    }) => (
      <Header>
        <TouchableOpacity
          onPress={() => {
            onPrevious();
          }}
        >
          <Icon name="chevron-left" size={20} color="grey" />
        </TouchableOpacity>

        <HeaderTitle>{title}</HeaderTitle>
        {!isLast ? (
          <Button
            style={{ width: 100 }}
            disabled={!nextAllowed}
            color="blue"
            title="Next"
            onPress={onNext}
          />
        ) : (
          <View />
        )}
      </Header>
    ),
    steps: [
      {
        title: "Job Type",
        content: JobInfo,
        nextAllowed: ({ currentJob }) => currentJob.isValid()
      },
      {
        title: "Sector",
        content: ({ currentJob, store }) => (
          <SectorList
            onPress={sector => {
              currentJob.map.set("sector", sector);
              store.next();
            }}
          />
        )
      },
      {
        title: "Date",
        content: props => <DateItem {...props} />,
        nextAllowed: () => true
      },
      {
        title: "Where ?",
        content: ({ currentJob, store }) => (
          <AutoCompleteLocation
            onLocation={location => currentJob.setLocation(location)}
            store={store}
          />
        ),
        nextAllowed: ({ currentJob }) => currentJob.hasLocation()
      },
      {
        title: "Company Info",
        content: CompanyInfo,
        nextAllowed: ({ currentJob }) => currentJob.isCompanyInfoValid()
      },
      {
        title: "Picture",
        content: JobPicture
      },
      {
        title: "Final Review",
        content: ({ onJobCreated, store, ...props }) => (
          <View>
            <Button
              color="blue"
              title="Create Job Post Now"
              onPress={() => {
                store.reset();
                onJobCreated();
              }}
            />
            <JobEdit {...props} />
          </View>
        )
      }
    ]
  };

  const Wizard = require("components/Wizard").default(context, wizardConfig);

  return Wizard.View;
};
