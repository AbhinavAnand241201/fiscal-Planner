"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QrCode, Camera, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

export default function PaymentsPage() {
  const [showQrScannerDialog, setShowQrScannerDialog] = useState(false);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">UPI Payments</h1>
        <p className="text-muted-foreground">Quickly make payments by scanning QR codes.</p>
      </header>

      <Card className="shadow-lg max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-6 w-6 text-primary" />
            Scan & Pay
          </CardTitle>
          <CardDescription>Use UPI to make secure and instant payments.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="my-6">
            <Image 
              src="https://placehold.co/300x300.png?text=Scan+QR+Here" 
              alt="QR Code Placeholder" 
              width={200} 
              height={200}
              data-ai-hint="qr code"
              className="mx-auto rounded-lg border p-2 shadow-sm"
            />
          </div>
          
          <AlertDialog open={showQrScannerDialog} onOpenChange={setShowQrScannerDialog}>
            <AlertDialogTrigger asChild>
              <Button className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Camera className="mr-2 h-5 w-5" /> Scan QR Code to Pay
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>UPI Payment Simulation</AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="my-4 flex justify-center">
                     <Image src="https://placehold.co/200x200.png?text=Camera+View" alt="Simulated Camera View" data-ai-hint="camera lens" width={150} height={150} />
                  </div>
                  This is a simulated UPI payment feature. In a real application, this would activate your device's camera to scan a merchant's QR code for payment processing.
                  <br/><br/>
                  <strong>This feature is for demonstration purposes only and does not process real payments.</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setShowQrScannerDialog(false)}>Understood</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <p className="mt-6 text-sm text-muted-foreground">
            Fiscal Compass helps you manage your finances, including making payments seamlessly.
            <br/>
            <span className="font-semibold">(UPI payment functionality is currently a mock-up.)</span>
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>How UPI Payments Work (Simplified)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1. Open the payment app and select "Scan QR Code".</p>
            <p>2. Point your camera at the merchant's QR code.</p>
            <p>3. The app automatically detects payee details.</p>
            <p>4. Enter the amount and your UPI PIN to authorize.</p>
            <p>5. Payment is transferred instantly!</p>
        </CardContent>
      </Card>
    </div>
  );
}
