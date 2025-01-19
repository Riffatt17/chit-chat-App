// import { ViewIcon } from "@chakra-ui/icons";
// import {
//   IconButton,
//   useDisclosure,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Image,
//   Text,
// } from "@chakra-ui/react";
// import React from "react";

// const ProfileModal = ({ user, children }) => {
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   return (
//     <>
//       {children ? (
//         <span onClick={onOpen}>{children}</span>
//       ) : (
//         <IconButton
//           display={{ base: "flex" }}
//           icon={<ViewIcon />}
//           onClick={onOpen}
//         />
//       )}
//       <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
//         <ModalOverlay />
//         <ModalContent height="410px">
//           <ModalHeader
//             fontSize="40px"
//             fontFamily={"monospace"}
//             display="flex"
//             justifyContent="center"
//           >
//             {user.name}
//           </ModalHeader>
//           <ModalCloseButton />
//           <ModalBody
//             display="flex"
//             flexDirection="column"
//             alignItems="center"
//             justifyContent="space-between"
//           >
//             <Image
//               borderRadius="full"
//               boxSize="150px"
//               src={user.pic}
//               alt={user.name}
//             />
//             <Text
//               fontSize={{ base: "28px", md: "30px" }}
//               fontFamily={"cursive"}
//             >
//               Email: {user.email}
//             </Text>
//           </ModalBody>

//           <ModalFooter>
//             <Button colorScheme="blue" mr={3} onClick={onClose}>
//               Close
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default ProfileModal;

import { ViewIcon } from "@chakra-ui/icons";
import {
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Text,
} from "@chakra-ui/react";
import React from "react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Providing default values to handle null user data
  const userName = user?.name || "Unknown User";
  const userPic = user?.pic || "default-pic-url";
  const userEmail = user?.email || "No email provided";

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent height="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily={"monospace"}
            display="flex"
            justifyContent="center"
          >
            {userName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={userPic}
              alt={userName}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily={"cursive"}
            >
              Email: {userEmail}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
