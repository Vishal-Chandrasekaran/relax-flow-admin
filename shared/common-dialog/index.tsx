/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useState} from 'react';
import {CommonDialog} from '../../types/CommonTypes';
import {isDialogOpen} from '@/utils/CommonService';
import {randomBytes} from 'crypto';

const ConfirmDialog = () => {
  const defaultOptions = {
    open: false,
    data: {message: 'Are you Sure?', title: ''},
    cancelText: 'Cancel',
    confirmText: 'Okay',
    onConfirm: () => {}
  };

  const [dialogOptions, setDialogOptions] =
    useState<CommonDialog>(defaultOptions);

  isDialogOpen.subscribe((data: CommonDialog) => {
    if (data.open && !dialogOptions.open){
        setDialogOptions(data);
    }
    else if (!data.open && dialogOptions.open){
         setDialogOptions(defaultOptions);
    }
  });

  const {open, data, cancelText, confirmText, onConfirm} = dialogOptions;

  const handleConfirm = (confirm: boolean) => {
    if (typeof onConfirm !== 'undefined'){
         onConfirm(confirm);
    }
    isDialogOpen.onNext(defaultOptions);
  };

  const handleClose = () => {
    isDialogOpen.onNext(defaultOptions);
  };

  return (
    <>
      {open && (
        <div className='react-confirm-alert-overlay'>
          <div className='confirmModel'>
            <div className='modelHeader'>
              {data.title ? <h4>{data.title}</h4> : null}
              <button onClick={handleClose}>X</button>
            </div>
            <div className='modelBody'>
              <p>{data.message}</p>
            </div>
            <div className='comonWdth btnWrap commonModelFooter'>
              <button
                className='mr-3 btn_secondary'
                color='primary'
                onClick={handleClose}
              >
                {cancelText}
              </button>
              {confirmText ? (
                <button onClick={() => handleConfirm(true)}>
                  {confirmText}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmDialog;

export function LogoutPopupContent() {
  return (
    <div style={{alignItems: 'center'}}>
      <h1>logout!</h1>
      <p>You have been logout successfully.</p>
    </div>
  );
}

function getSecureRandomNumber(): number {
  // Generate 4 random bytes
  const buffer = randomBytes(4);
  // Convert to a 32-bit integer
  const randomValue = buffer.readUInt32BE(0);
  // Normalize to [0,1]
  const normalisedArrayValue = 0xffffffff;
  return randomValue / normalisedArrayValue;
}

function base64ToBlob(base64: any, mimeType: string): Blob {
  const byteString = window.atob(base64.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const int8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([int8Array], {type: mimeType});
}

function getMimeTypeFromBase64(base64: string): string | null {
  const regex = /^data:([a-zA-Z0-9-+\/]+);base64,/;
  const match = base64.match(regex);
  return match ? match[1] : null;
}

function generateUniqueFilename(mimeType: string): string {
  const extension = mimeType.split('/')[1];
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(getSecureRandomNumber() * 1000);
  return `image-${timestamp}-${randomNum}.${extension}`;
}

export function base64ToFile(base64: any): File {
  const mimeType = getMimeTypeFromBase64(base64);
  if (mimeType === null) {
    throw new Error('Invalid base64 string: Unable to extract MIME type.');
  }

  const blob = base64ToBlob(base64, mimeType); // Ensure mimeType is a valid string here
  const filename = generateUniqueFilename(mimeType);
  return new File([blob], filename, {type: mimeType});
}
