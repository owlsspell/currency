import React, { useCallback, useState } from "react";
import { Button, TextContainer, Modal } from "@shopify/polaris";

export default function ModalAuth(props) {
  debugger;
  // const [active, setActive] = useState(false);

  // const handleChange = useCallback(() => setActive(!active), [active]);

  // const activator = <Button onClick={handleChange}>Open</Button>;

  return (
    <div style={{ height: "500px" }}>
      <Modal
        activator={props.handleChange}
        open={props.active}
        onClose={() => {
          props.handleChange();
          // props.changeAuth();
        }}
        title={props.title}
        // primaryAction={{
        //   content: "Add Instagram",
        //   onAction: props.handleChange,
        // }}
        // secondaryActions={[
        //   {
        //     content: "Learn more",
        //     onAction: props.handleChange,
        //   },
        // ]}
      >
        {/* <Modal.Section>
          <TextContainer>
            <p>
              Use Instagram posts to share your products with millions of
              people. Let shoppers buy from your store without leaving
              Instagram.
            </p>
          </TextContainer>
        </Modal.Section> */}
      </Modal>
    </div>
  );
}
