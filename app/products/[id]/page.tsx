import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { products, doctors } from "@/lib/data"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Settings, LinkIcon, Users, CheckCircle2, FileText } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params
  const product = products.find((p) => p.id === id)

  if (!product) {
    notFound()
  }

  // Find doctors who might use this product (simplified - would be based on operations in real app)
  const relatedDoctors = doctors.slice(0, 3)

  // Find compatible products
  const compatibleProducts = products.filter((p) =>
    product.compatibleWith.some((c) => p.name.includes(c.split("™")[0]) || p.name.includes(c.split(" ")[0])),
  )

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="px-4 py-4">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Product Hub
        </Link>

        <Card className="mb-4 overflow-hidden border-0 shadow-lg">
          <div className="relative h-56 w-full bg-gradient-to-br from-muted to-muted/30">
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain p-6"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <CardContent className="pt-4">
            <Badge variant="outline" className="mb-2 text-primary border-primary/30">
              {product.category}
            </Badge>
            <h1 className="text-2xl font-bold text-card-foreground mb-1">{product.name}</h1>
            <p className="text-sm text-muted-foreground mb-3">Product Code: {product.sku}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="specs">Specs</TabsTrigger>
            <TabsTrigger value="compatible">Related</TabsTrigger>
          </TabsList>

          <TabsContent value="features">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Features & Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(product.specifications)
                    .slice(0, 4)
                    .map(([key, value]) => (
                      <div key={key} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-card-foreground">{key}</h4>
                          <p className="text-sm text-muted-foreground">{value}</p>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Compatible With Section */}
                <div className="mt-6">
                  <h4 className="font-semibold text-sm text-card-foreground mb-3 flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-primary" />
                    Compatible With
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.compatibleWith.map((item, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Specifications Tab */}
          <TabsContent value="specs">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary" />
                  Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 text-sm">
                      <span className="text-muted-foreground font-medium">{key}</span>
                      <span className="text-card-foreground text-right ml-4 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resources Card */}
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Product Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary transition-colors text-left">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">Surgical Technique Guide</p>
                      <p className="text-xs text-muted-foreground">PDF Download</p>
                    </div>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary transition-colors text-left">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">Product Brochure</p>
                      <p className="text-xs text-muted-foreground">PDF Download</p>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Related/Compatible Tab */}
          <TabsContent value="compatible" className="space-y-4">
            {/* Related Products */}
            {compatibleProducts.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-primary" />
                    Related Products
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {compatibleProducts.slice(0, 4).map((p) => (
                    <Link key={p.id} href={`/products/${p.id}`}>
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors">
                        <div className="relative h-14 w-14 rounded-lg bg-muted overflow-hidden shrink-0">
                          <Image
                            src={p.imageUrl || "/placeholder.svg"}
                            alt={p.name}
                            fill
                            className="object-contain p-1"
                            sizes="56px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-card-foreground truncate">{p.name}</h4>
                          <p className="text-xs text-muted-foreground">{p.category}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Surgeons Using */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Surgeons Using This Product
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {relatedDoctors.map((doctor) => (
                    <Link key={doctor.id} href={`/doctors/${doctor.id}`}>
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded-full bg-muted overflow-hidden">
                            <Image
                              src={doctor.imageUrl || "/placeholder.svg"}
                              alt={doctor.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-card-foreground">{doctor.name}</h4>
                            <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          View
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <MobileNav />
    </div>
  )
}
