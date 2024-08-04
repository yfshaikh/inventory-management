'use client'
import Image from "next/image";
import { useState,useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Typography, Modal, Stack, TextField, Button } from "@mui/material";
import { collection, query, getDocs, getDoc, setDoc, doc, deleteDoc } from "firebase/firestore";


export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const updateInventory = async () => {
    // store inventory from firestore in snapshot instance
    const snapshot = query(collection(firestore, 'inventory'))

    // get docs from inventory
    const docs = await getDocs(snapshot)

    // for each doc, add its id and data into inventoryList
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const removeItem = async (item) => {
    // get the direct reference for the item
    const docRef = doc(collection(firestore, "inventory"), item)

    // gets the document reference from the invenstory (if it exists)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      // quantity is a field of boxes
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }


  const addItem = async (item) => {
    // get the direct reference for the item
    const docRef = doc(collection(firestore, "inventory"), item)

    // gets the document reference from the invenstory (if it exists)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      // quantity is a field of boxes
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }


  // update inventory every time the page loads
  useEffect(()=> {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  
  return (
    <Box width='100vw' height='100vh' display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} gap={2}>

      <Modal open={open} onClose={handleClose}>

        <Box position={'absolute'} top={'50%'} left={'50%'} width={400} bgcolor={'white'} border={'2px solid black'} boxShadow={24} padding={4} display={'flex'} flexDirection={'column'} gap={3} sx={{ transform: 'translate(-50%, -50%' }}>

          <Typography variant='h6'>Add Item</Typography>

          <Stack width={'100%'} direction={'row'} spacing={2}>

            <TextField variant="outlined" fullWidth value={itemName} onChange={e => setItemName(e.target.value)} />

            <Button variant="outlined" onClick={() => { addItem(itemName); setItemName(''); handleClose() }}>Add</Button>

          </Stack>

        </Box>

      </Modal>

      <Button variant="contained" onClick={() => {handleOpen()}}>Add new item</Button>

      <Box border={'1px solid black'}>
        <Box width={'800px'} height={'100px'} bgcolor={'lightblue'} alignItems={'center'} justifyContent={'center'} display={'flex'}>
          <Typography variant="h2" color={'#333'}>Inventory Items</Typography>
        </Box>

      <Stack width={'800px'} height={'300px'} spacing={2} overflow={'auto'}>
        {
          inventory.map(({name, quantity}) => (
            <Box key={name} width={'100%'} minHeight={'150px'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} bgcolor={'#f0f0f0'} padding={5}>
              <Typography variant="h3" color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color={'#333'} textAlign={'center'}>
                {quantity}
              </Typography>
              <Stack direction={'row'} spacing={2}>
                <Button variant="contained" onClick={() => {addItem(name)}}>Add</Button>
                <Button variant="contained" onClick={() => {removeItem(name)}}>Remove</Button>
              </Stack>
            </Box>
          ))
        }
      </Stack>


      </Box>
    </Box>
  );
}
