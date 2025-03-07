"use client"

import type React from "react"

import { useState, type FormEvent, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { FertilityLogo } from "@/components/fertility-logo"
import { ArrowRight, ChevronRight, DollarSign, Search, Star, Check, CreditCard, RefreshCw, MapPin } from "lucide-react"

// Define types for our clinic data
type Clinic = {
  name: string
  procedure: string
  medication: string
  anesthesia: string
  other: string
  total: string
  rating: number
  distance: number
  highlight: boolean
}

// Define types for our procedure options
type ProcedureOption = {
  id: string
  name: string
  baseCost: number
  medicationCost: number
  anesthesiaCost: number
  otherCost: number
}

export default function LandingPage() {
  const [isThankYouOpen, setIsThankYouOpen] = useState(false)
  const [email, setEmail] = useState("")

  // Demo tool state
  const [zipCode, setZipCode] = useState("94107")
  const [selectedProcedure, setSelectedProcedure] = useState("ivf")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Procedure options
  const procedures: Record<string, ProcedureOption> = {
    ivf: {
      id: "ivf",
      name: "IVF",
      baseCost: 8500,
      medicationCost: 3000,
      anesthesiaCost: 800,
      otherCost: 450,
    },
    egg_freezing: {
      id: "egg_freezing",
      name: "Egg Freezing",
      baseCost: 7000,
      medicationCost: 2500,
      anesthesiaCost: 700,
      otherCost: 350,
    },
    embryo_freezing: {
      id: "embryo_freezing",
      name: "Embryo Freezing",
      baseCost: 6500,
      medicationCost: 2000,
      anesthesiaCost: 600,
      otherCost: 300,
    },
    iui: {
      id: "iui",
      name: "Intra Uterine Insemination (IUI)",
      baseCost: 1500,
      medicationCost: 800,
      anesthesiaCost: 0,
      otherCost: 200,
    },
  }

  // Generate random clinics based on zip code and procedure
  const generateClinics = (zip: string, procedureId: string): Clinic[] => {
    // Get the base costs for the selected procedure
    const procedure = procedures[procedureId]

    // Generate a seed from the zip code for consistent randomness
    const zipSeed = zip.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

    // Helper function to get a random number within a range, influenced by the zip seed
    const getRandomInRange = (min: number, max: number, index: number) => {
      const seed = (zipSeed + index) % 100
      return min + (seed / 100) * (max - min)
    }

    // Generate 5 clinics with variations based on the procedure costs
    return Array(5)
      .fill(null)
      .map((_, index) => {
        // Vary the costs based on the clinic index and zip seed
        const variationFactor = getRandomInRange(0.8, 1.2, index)
        const procedureCost = Math.round(procedure.baseCost * variationFactor)
        const medicationCost = Math.round(procedure.medicationCost * getRandomInRange(0.9, 1.1, index + 10))
        const anesthesiaCost = Math.round(procedure.anesthesiaCost * getRandomInRange(0.85, 1.15, index + 20))
        const otherCost = Math.round(procedure.otherCost * getRandomInRange(0.7, 1.3, index + 30))
        const totalCost = procedureCost + medicationCost + anesthesiaCost + otherCost

        // Generate a clinic name based on the zip and index
        const clinicNames = [
          "Bay Area Fertility Center",
          "Pacific Reproductive Services",
          "Golden Gate Fertility",
          "SF Women's Health",
          "California Fertility Partners",
          "Coastal Fertility Specialists",
          "Modern Family Clinic",
          "Sunrise Fertility Center",
          "Family Beginnings IVF",
          "New Hope Fertility",
        ]

        // Use the zip seed to select and shuffle clinic names
        const nameIndex = (zipSeed + index * 3) % clinicNames.length
        const name = clinicNames[nameIndex]

        // Generate a rating between 4.0 and 5.0
        const rating = 4 + getRandomInRange(0, 1, index + 40)

        // Generate a distance between 0.5 and 10 miles
        const distance = getRandomInRange(0.5, 10, index + 50)

        return {
          name,
          procedure: `$${procedureCost.toLocaleString()}`,
          medication: `$${medicationCost.toLocaleString()}`,
          anesthesia: `$${anesthesiaCost.toLocaleString()}`,
          other: `$${otherCost.toLocaleString()}`,
          total: `$${totalCost.toLocaleString()}`,
          rating: Number.parseFloat(rating.toFixed(1)),
          distance: Number.parseFloat(distance.toFixed(1)),
          highlight: index === 0, // Highlight the first clinic
        }
      })
      .sort((a, b) => {
        // Sort by total cost (removing $ and commas)
        const aTotal = Number.parseInt(a.total.replace(/[$,]/g, ""))
        const bTotal = Number.parseInt(b.total.replace(/[$,]/g, ""))
        return aTotal - bTotal
      })
  }

  // Handle form submission for the demo tool
  const handleDemoSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setHasInteracted(true)

    // Simulate API call delay
    setTimeout(() => {
      const newClinics = generateClinics(zipCode, selectedProcedure)
      setClinics(newClinics)
      setIsLoading(false)
    }, 800)
  }

  // Initialize clinics on first render
  useEffect(() => {
    const newClinics = generateClinics(zipCode, selectedProcedure)
    setClinics(newClinics)
  }, [zipCode, selectedProcedure])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      // Submit the email to our API endpoint that will forward to Google Form
      const response = await fetch("/api/submit-form", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to submit form")
      }

      // Show thank you dialog
      setIsThankYouOpen(true)
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("There was an error submitting your email. Please try again.")
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-primary">
            <FertilityLogo className="h-8 w-8" />
            <span>FertilityBase</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              How It Works
            </Link>
            <Link href="#demo" className="text-sm font-medium transition-colors hover:text-primary">
              Demo
            </Link>
            <Link href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
              Pricing
            </Link>
            <Link href="#contact" className="text-sm font-medium transition-colors hover:text-primary">
              Get Access
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="#contact">
              <Button size="sm" className="bg-secondary hover:bg-secondary/90">
                Buy Now
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                    Save thousands on IVF, egg freezing, and embryo freezing
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    FertilityBase compiles actual pricing data from fertility clinics nationwide, helping you find
                    affordable treatment without compromising on quality. Compare prices, read verified reviews, and
                    make informed decisions.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="#contact">
                    <Button className="w-full min-[400px]:w-auto bg-secondary hover:bg-secondary/90">
                      Compare Prices Now
                      <Search className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button
                      variant="outline"
                      className="w-full min-[400px]:w-auto border-primary text-primary hover:bg-primary/10"
                    >
                      How It Works
                      <ChevronRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative mx-auto aspect-video overflow-hidden rounded-xl sm:w-full lg:order-last lg:aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-xl"></div>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jakob-owens-M0M-FR2iedk-unsplash.jpg-qAynBzEQXuDH1Ru9wVl3plUdXU8HML.jpeg"
                  width={550}
                  height={550}
                  alt="A couple walking hand in hand with their young child on a peaceful nature path"
                  className="h-full w-full object-cover shadow-lg shadow-primary/20"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">
                  Make Informed Fertility Treatment Decisions
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Fertility treatments can be emotionally taxing and financially overwhelming. FertilityBase simplifies
                  your journey by finding you the best deals without compromising on quality care.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 rounded-lg border border-primary/20 p-6 shadow-sm bg-gradient-to-b from-white to-primary/5">
                <div className="rounded-full bg-primary/10 p-3">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary">Price Transparency</h3>
                <p className="text-center text-muted-foreground">
                  Access comprehensive pricing data for IVF, egg freezing, and embryo freezing from clinics in your
                  area, updated regularly. All prices are broken down by procedure cost, medication expenses, and
                  anesthesia fees for complete transparency.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border border-secondary/20 p-6 shadow-sm bg-gradient-to-b from-white to-secondary/5">
                <div className="rounded-full bg-secondary/10 p-3">
                  <Star className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-secondary">Verified Reviews</h3>
                <p className="text-center text-muted-foreground">
                  Read authentic patient reviews and ratings to ensure you're choosing a clinic that provides quality
                  care and service.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border border-primary/20 p-6 shadow-sm bg-gradient-to-b from-white to-primary/5">
                <div className="rounded-full bg-primary/10 p-3">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary">Easy Comparison</h3>
                <p className="text-center text-muted-foreground">
                  Compare multiple clinics side-by-side to find the perfect balance of affordability and quality for
                  your fertility journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="demo" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                  Demo
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">
                  Shop Around and Save Thousands
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Fertility treatment prices can vary by $5,000-$10,000 between clinics in the same area. Try our
                  interactive tool below to see how much you could save.
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-5xl mt-10 rounded-xl overflow-hidden shadow-xl border border-primary/20">
              <div className="bg-white">
                {/* Search Controls */}
                <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-4">
                  <form
                    onSubmit={handleDemoSubmit}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                  >
                    <div className="text-lg font-medium">Fertility Treatment Price Comparison</div>
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                      <div className="relative rounded-md bg-white/20 px-3 py-1.5 text-sm flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-white/80" />
                        <Input
                          type="text"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          placeholder="Enter ZIP code"
                          className="w-24 h-6 p-0 pl-1 bg-transparent border-none text-white placeholder:text-white/50 focus-visible:ring-0"
                          maxLength={5}
                          pattern="[0-9]*"
                        />
                      </div>
                      <div className="relative">
                        <div
                          className="relative rounded-md bg-white/20 px-3 py-1.5 text-sm flex items-center cursor-pointer min-w-[200px]"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                          <span className="text-white/80 mr-2">Procedure:</span>
                          <span className="font-medium">{procedures[selectedProcedure].name}</span>
                          <svg
                            className={`h-4 w-4 ml-1 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        {isDropdownOpen && (
                          <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              {Object.values(procedures).map((proc) => (
                                <div
                                  key={proc.id}
                                  className={`px-4 py-2 text-sm cursor-pointer ${
                                    selectedProcedure === proc.id
                                      ? "text-primary font-medium bg-primary/10"
                                      : "text-gray-700 hover:bg-gray-100"
                                  }`}
                                  onClick={() => {
                                    setSelectedProcedure(proc.id)
                                    setIsDropdownOpen(false)
                                  }}
                                >
                                  {proc.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <Button
                        type="submit"
                        className="rounded-md bg-white/20 hover:bg-white/30 px-3 py-1.5 text-sm transition-colors h-auto"
                        disabled={isLoading}
                      >
                        {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Update Results"}
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Results Table */}
                <div className="relative">
                  <div className="px-4 py-4 overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden border-b rounded-md">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Clinic Name
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Procedure Cost
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Medication
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Anesthesia
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Other Costs
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Total Cost
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Rating
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {clinics.map((clinic, index) => (
                              <tr key={index} className={index === 0 ? "bg-primary/5" : ""}>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-primary">{clinic.name}</div>
                                  <div className="text-xs text-gray-500">{clinic.distance} miles away</div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {clinic.procedure}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {clinic.medication}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {clinic.anesthesia}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{clinic.other}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="text-sm font-bold text-secondary">{clinic.total}</div>
                                  {index === 0 && (
                                    <div className="text-xs font-medium text-green-600">Lowest price!</div>
                                  )}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex">
                                      {Array(5)
                                        .fill(0)
                                        .map((_, i) => (
                                          <svg
                                            key={i}
                                            className={`h-4 w-4 ${
                                              i < Math.floor(clinic.rating) ? "text-yellow-400" : "text-gray-300"
                                            }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                          >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                          </svg>
                                        ))}
                                    </div>
                                    <span className="ml-1 text-xs text-gray-500">
                                      {clinic.rating} <span className="text-xs text-gray-400">(Yelp)</span>
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Hint - Only show if user hasn't interacted yet */}
                  {!hasInteracted && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-md">
                      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md text-center">
                        <h3 className="text-xl font-bold text-primary mb-2">Try It Yourself!</h3>
                        <p className="text-muted-foreground mb-4">
                          Enter your ZIP code and select a procedure to see price comparisons from clinics in your area.
                        </p>
                        <Button onClick={() => setHasInteracted(true)} className="bg-secondary hover:bg-secondary/90">
                          Start Comparing
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Caption */}
                <div className="px-4 py-3 bg-gray-50 text-center text-sm text-gray-500">
                  <p>
                    This interactive demo shows sample data. Subscribe for access to actual pricing from clinics
                    nationwide.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Link href="#contact">
                <Button className="bg-secondary hover:bg-secondary/90">
                  Get Full Access
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Affordable Access
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">
                  Simple, Transparent Pricing
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get access to all the information you need to make informed fertility treatment decisions at an
                  affordable monthly price.
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-md mt-10">
              <div className="rounded-xl overflow-hidden shadow-xl border border-primary/20">
                <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-4">
                  <h3 className="text-2xl font-bold">FertilityBase Membership</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-4xl font-extrabold">$59.99</span>
                    <span className="ml-1 text-xl font-medium">/year</span>
                  </div>
                </div>

                <div className="p-6 bg-white">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-secondary mt-0.5 mr-2 flex-shrink-0" />
                      <span>Detailed pricing estimates for clinics in your area or an area of your choosing</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-secondary mt-0.5 mr-2 flex-shrink-0" />
                      <span>Aggregated patient review data for each clinic</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-secondary mt-0.5 mr-2 flex-shrink-0" />
                      <span>Compare up to 10 clinics side-by-side</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-secondary mt-0.5 mr-2 flex-shrink-0" />
                      <span>Save favorite clinics for future reference</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-secondary mt-0.5 mr-2 flex-shrink-0" />
                      <span>Monthly price updates and new clinic alerts</span>
                    </li>
                  </ul>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-muted-foreground mr-2" />
                      <span className="text-sm text-muted-foreground">Billed annually, cancel anytime</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link href="#contact">
                      <Button className="w-full bg-secondary hover:bg-secondary/90">
                        Buy Now
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  By subscribing annually, you save over 37% compared to monthly billing.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your subscription could help you save thousands on fertility treatments.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 to-secondary/10"
        >
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-primary">
                Start Saving on Your Fertility Journey Today
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of people who have saved thousands of dollars on their fertility treatments. Enter your
                email for early access to our price comparison tool.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <Input
                  type="email"
                  placeholder="Your email"
                  className="w-full border-primary/20 focus-visible:ring-primary"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90">
                  Buy Now
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background">
        <div className="container flex flex-col gap-4 px-4 py-10 md:px-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 font-bold text-primary">
              <FertilityLogo className="h-6 w-6" />
              <span>FertilityBase</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Helping you find affordable, high-quality fertility care through price transparency and verified reviews
              since 2023.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-primary/60 hover:text-primary">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-primary/60 hover:text-primary">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-secondary/60 hover:text-secondary">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.043.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.067-.06-1.407-.06-4.123v-.08c0-2.643.012-2.987.06-4.043.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.048 1.407-.06 4.043-.06h.08c2.643 0 2.987.012 4.043.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.066.06 1.407.06 4.122v.08c0 2.643-.012 2.987-.06 4.043z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between">
            <p className="text-xs text-muted-foreground">&copy; 2023 FertilityBase. All rights reserved.</p>
            <div className="flex gap-4 mt-2 md:mt-0">
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
      {isThankYouOpen && (
        <Dialog open={isThankYouOpen} onOpenChange={setIsThankYouOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-primary text-xl">Thank You!</DialogTitle>
              <DialogDescription className="pt-2">
                <p>Thank you for your interest in FertilityBase!</p>
                <p className="mt-2">You've been added to our waitlist and we'll be in touch soon.</p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

